# دليل النشر على Netlify

## خطوات النشر على Netlify

### الطريقة الأولى: السحب والإفلات (Drag & Drop)

1. اذهب إلى [Netlify](https://www.netlify.com/)
2. سجل دخول أو أنشئ حساب جديد
3. في الصفحة الرئيسية، اسحب مجلد المشروع بالكامل (أو الملفات) إلى منطقة "Deploy manually"
4. انتظر حتى يكتمل النشر
5. ستحصل على رابط للموقع (مثل: `your-site-name.netlify.app`)

### الطريقة الثانية: ربط GitHub/GitLab

1. ارفع المشروع إلى GitHub أو GitLab
2. في Netlify، اختر "Add new site" > "Import an existing project"
3. اختر GitHub/GitLab واذهب إلى المستودع
4. Netlify سيكتشف الإعدادات تلقائياً من ملف `netlify.toml`
5. اضغط "Deploy site"

### الطريقة الثالثة: Netlify CLI

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# نشر الموقع
netlify deploy

# للنشر الدائم
netlify deploy --prod
```

## إعدادات مخصصة

تم إعداد ملف `netlify.toml` مسبقاً مع:
- ✅ إعادة توجيه تلقائية
- ✅ تحسينات الأمان (Security Headers)
- ✅ تحسينات الأداء (Caching)

## تحديث الموقع

بعد أي تعديلات:
- إذا استخدمت السحب والإفلات: اسحب الملفات المحدثة مرة أخرى
- إذا ربطت GitHub: ادفع التغييرات وسيتم النشر تلقائياً
- إذا استخدمت CLI: نفذ `netlify deploy --prod`

## نصائح إضافية

1. **اسم الموقع**: يمكنك تغيير اسم الموقع من إعدادات Netlify
2. **نطاق مخصص**: يمكنك إضافة نطاق خاص بك من إعدادات Domain
3. **SSL**: Netlify يوفر شهادة SSL مجانية تلقائياً
4. **التحديثات التلقائية**: عند ربط GitHub، أي تحديث سيتم نشره تلقائياً

## الدعم

إذا واجهت أي مشاكل، راجع [وثائق Netlify](https://docs.netlify.com/)

