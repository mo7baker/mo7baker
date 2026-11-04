#!/usr/bin/env python3
"""Render a transparent, honest sample of public GitHub events into a portable SVG.

Run from any directory: python scripts/generate_activity.py
Uses GITHUB_TOKEN when available, or the unauthenticated public API.
Event feeds are limited samples, not full contribution histories.
"""
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from html import escape
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'assets' / 'github-activity.svg'
USERNAME = 'mo7baker'


def get_events():
    token = os.getenv('GITHUB_TOKEN', '')
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'mo7baker-profile-metrics'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    result = []
    for page in range(1, 4):
        req = Request(f'https://api.github.com/users/{USERNAME}/events/public?per_page=100&page={page}', headers=headers)
        with urlopen(req, timeout=20) as response:
            batch = json.load(response)
        if not isinstance(batch, list):
            raise RuntimeError('Unexpected GitHub API response')
        result.extend(batch)
        if len(batch) < 100:
            break
    return result


def monday_utc(d):
    d = d.replace(hour=0, minute=0, second=0, microsecond=0)
    return d - timedelta(days=d.weekday())


def render(data=None):
    now = datetime.now(timezone.utc)
    current_monday = monday_utc(now)
    weeks = [current_monday - timedelta(weeks=i) for i in range(7, -1, -1)]
    counts = [0] * 8
    if data is not None:
        for event in data:
            timestamp = event.get('created_at')
            if not timestamp:
                continue
            when = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            idx = (monday_utc(when) - weeks[0]).days // 7
            if 0 <= idx < 8:
                counts[idx] += 1
    maximum = max(max(counts), 1)
    change = counts[-1] - counts[-2]
    direction = '↑' if change > 0 else '↓' if change < 0 else '→'
    trend_color = '#68e4ba' if change > 0 else '#ffbe9e' if change < 0 else '#a2aaca'
    total = sum(counts)
    bars = []
    for i, (week, num) in enumerate(zip(weeks, counts)):
        x = 58 + i * 101
        height = round(num / maximum * 137) if data is not None else 0
        height = max(3, height)
        y = 246 - height
        fill = 'url(#barBlue)' if i == 7 else 'url(#bar)'
        bars.append(f'<rect x="{x}" y="{y}" width="54" height="{height}" rx="5" fill="{fill}"/><text x="{x+27}" y="{max(105,y-8)}" text-anchor="middle" fill="#e8eaff" font-family="monospace" font-size="12">{num if data is not None else ""}</text><text x="{x+27}" y="271" text-anchor="middle" fill="#a5b1d3" font-family="monospace" font-size="11">{week.strftime("%b %d")}</text>')
    if data is None:
        status = 'Run the Update GitHub Metrics action to load public data.'
        change_label = 'Not generated yet'
    else:
        status = f'{total} sampled public events · refreshed {now.strftime("%Y-%m-%d %H:%M UTC")}'
        change_label = f'{direction} {change:+d} vs previous week'
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="920" height="335" viewBox="0 0 920 335" role="img" aria-label="Recent public GitHub events per week">
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#101a35"/><stop offset="1" stop-color="#0b1024"/></linearGradient><linearGradient id="bar" x2="0" y2="1"><stop stop-color="#a077ff"/><stop offset="1" stop-color="#4b43b4"/></linearGradient><linearGradient id="barBlue" x2="0" y2="1"><stop stop-color="#72d7ff"/><stop offset="1" stop-color="#5772eb"/></linearGradient></defs>
<rect x="1" y="1" width="918" height="333" rx="17" fill="url(#bg)" stroke="#374268"/>
<text x="36" y="41" fill="#b29aff" font-family="monospace" font-size="12" letter-spacing="2">MOHAMMED / AI</text>
<text x="36" y="74" fill="#f4f5ff" font-family="Arial,sans-serif" font-size="24" font-weight="bold">GitHub Development Pulse</text>
<text x="882" y="44" text-anchor="end" fill="{trend_color}" font-family="monospace" font-size="15">{escape(change_label)}</text>
<text x="882" y="69" text-anchor="end" fill="#a4b1d2" font-family="monospace" font-size="11">PUBLIC EVENTS • 8 WEEKS</text>
<path d="M38 246H882 M38 179H882 M38 111H882" stroke="#323b5c" stroke-dasharray="4 7" stroke-width="1"/>
{''.join(bars)}
<text x="36" y="310" fill="#8f9fc3" font-family="monospace" font-size="11">{escape(status)}</text>
</svg>'''
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(svg, encoding='utf-8')
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    if '--placeholder' in sys.argv:
        render()
    else:
        try:
            render(get_events())
        except (HTTPError, URLError, TimeoutError, RuntimeError, ValueError) as exc:
            print(f'Could not refresh GitHub activity: {exc}', file=sys.stderr)
            sys.exit(1)
