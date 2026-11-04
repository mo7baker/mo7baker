# دليل تركيب ملف GitHub الاحترافي — mo7baker

تم تجهيز نسختين في حزمة واحدة:

1. `README.md` — يظهر مباشرة داخل صفحة ملفك الشخصي على GitHub.
2. `docs/index.html` — موقع Portfolio تفاعلي مستوحى من التصميم المرجعي، بأقسام المهارات والمشاريع والنشاط والتقدم.

## خطوات الرفع (بدون برامج)

1. افتح `https://github.com/mo7baker`، وسجّل دخولك.
2. أنشئ مستودعًا **Public** اسمه بالضبط `mo7baker`، إذا لم يكن موجودًا بالفعل.
3. افتح المستودع، ثم `Add file` → `Upload files`.
4. ارفع **كل ملفات ومجلدات الحزمة** إلى جذر المستودع، بما فيها `.github` و`docs` و`scripts` و`README.md`. عند رفع مجلدات من هاتف قد تحتاج إلى اختيار الملفات عبر الكمبيوتر أو استخدام Git. لا تضع كل شيء داخل مجلد إضافي باسم `mo7baker-ai-portfolio`.
5. اضغط `Commit changes`. ستظهر صفحة README على `github.com/mo7baker` عندما يكون المستودع عاما واسمه مطابقًا لاسم الحساب.
6. للموقع، افتح المستودع → `Settings` → `Pages` → `Build and deployment` → `Deploy from a branch` → اختر `main` والمجلد `/docs` → `Save`.
7. بعد النشر سيكون الرابط المتوقع `https://mo7baker.github.io/mo7baker/` (لا يصبح متاحًا حتى تنشره بنجاح).

## الرسم البياني الصاعد والهابط

- الموقع يعرض التغير في **الأحداث العامة** خلال الأسابيع الثمانية الأخيرة، اعتمادًا على واجهة GitHub العامة. إذا لم يتوفر الاتصال أو كانت الواجهة محدودة، يظهر إشعار صريح بدل رسم أرقام وهمية.
- صفحة README تملك رسم SVG يمكن تحديثه تلقائيا: من تبويب `Actions` اختر `Update GitHub Activity Graph` ثم `Run workflow` أول مرة. سيحاول التحديث يوميا.
- قد تحتاج إلى تفعيل `Settings` → `Actions` → `General` → `Workflow permissions` → `Read and write permissions` حتى يستطيع التحديث كتابة ملف SVG، إن كانت إعدادات حسابك تسمح بذلك.
- الرسم **ليس** عدد المساهمات الكلي؛ هو عينة من الأحداث العامة الأخيرة فحسب، وقد تظهر القيم قليلة إن كان الحساب جديدا.

## تغيير نسب تقدم المسار الدراسي

اذهب إلى `docs/data/roadmap.json`: كل مهمة فيها `"done": false`.
بعد إنجازها فعلا، غيّرها إلى `"done": true` واحفظ على GitHub. نسبة الإنجاز في الموقع تُحسب أوتوماتيكيا من عدد المهام المنجزة مقسومًا على عدد المهام الكلي. لا تكتب نسبة مهارات عشوائية.

## وضع صورتك الشخصية بدل الشعار

صورتك التي اخترتها موجودة الآن في `docs/assets/mohammed-portrait.webp`. لتبديلها، استبدل الملف بنفس الاسم ثم افتح `docs/index.html` وغير:

`src="assets/mohammed-portrait.webp"` إلى مسار صورتك الجديدة إذا غيّرت الاسم.

للحصول على صورة دائرية، أضف إلى آخر `docs/assets/style.css`:

`.avatar-wrap img { border-radius: 50%; object-fit: cover; }`

الصورة المستخدمة في نسخة الموقع الحالية هي البورتريه المعتمد الذي جهزناه بناءً على صورتك المرفوعة.

## تحديث المهارات وبيانات التواصل

- أسماء المهارات والحالة (`learning` أو `planned`) في مصفوفة `SKILLS` داخل `docs/assets/app.js`.
- الأسماء والنصوص والروابط في `docs/index.html` و`README.md`.
- حساب GitHub مضبوط افتراضيًا على `mo7baker`.
- رابط LinkedIn موضوع بحسب حسابك الذي شاركته سابقا؛ راجعه إن تغيّر.
- لا توجد مشاريع منشورة مزعومة ولا شهادات أو عملاء أو نسب مهارة وهمية.

## شكل الملفات

```text
mo7baker/
├── README.md
├── SETUP_AR.md
├── .github/
│   └── workflows/update-metrics.yml
├── scripts/generate_activity.py
└── docs/
    ├── index.html
    ├── .nojekyll
    ├── data/roadmap.json
    └── assets/
        ├── style.css
        ├── app.js
        ├── ai-avatar.svg
        ├── favicon.svg
        ├── brand-banner.png
        ├── mohammed-portrait.webp
        └── github-activity.svg
```
