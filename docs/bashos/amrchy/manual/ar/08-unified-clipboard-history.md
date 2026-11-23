---
source_file: amrchy/manual/ar/08-unified-clipboard-history.md
source_repo: bamr87/bashos
source_url: https://github.com/bamr87/bashos/blob/main/amrchy/manual/ar/08-unified-clipboard-history.md
title: الحافظة الموحدة والسجل
---
# الحافظة الموحدة والسجل

عادةً على Linux، تحتاج إلى `Ctrl + Shift + C/V` للنسخ واللصق في الطرفية وإلى `Ctrl + C/V` للقيام بذلك في كل مكان آخر. يصعب الاعتياد على ذلك لأي شخص لم يولد ويتربَّ على Linux! وكذلك الحال مع التبديل من super إلى ctrl، إذا كنت قادمًا من Mac.

يعالج Omarchy كلتا المشكلتين باختصارات حافظة موحدة تعمل (تقريبًا) في كل مكان. وهي:

| Hotkey | Command |
| ------- | ----------- |
| Super + A | تحديد الكل |
| Super + C | نسخ |
| Super + X | قص |
| Super + V | لصق |
| Super + Ctrl + V | سجل الحافظة |

_لاحظ أن معظم أطر تشغيل الوكلاء ستستخدم `Ctrl + V` للصق الصور، لكنها ستستخدم `Super + V` للصق النص._

استخدم `Super + A`، ثم `Super + C` لنسخ كل شيء في حقل نصي مُركَّز عليه أو في تطبيق آخر يدعم `Ctrl + A`. في الطرفية، ينقل `Ctrl + A` إلى بداية سطر الأوامر بدلًا من تحديد نصه.

### سجل الحافظة

توفر Omarchy shell سجل الحافظة، وهو يعمل لكلٍّ من النصوص والصور. تشغّله بالضغط على `Super + Ctrl + V`، وتختار الإدخال المطلوب بالضغط على return، وبعد ذلك سيُوضع على الحافظة جاهزًا للصق بالضغط على `Super + V`.

 ![clipboard-history](images/clipboard-history.webp)

يمكنك أيضًا البحث في السجل بمجرد البدء في الكتابة:

 ![clipboard-history-search](images/clipboard-history-search.webp)
