# 💙 الحب من طرف واحد - HubbMinTaraf

تطبيق شات ذكي يعلمك الحب والعلاقات العاطفية، مبني بـ React + Node.js + OpenAI.

---

## 🚀 كيفاش تشغلو

### 1. الباكند

```bash
cd backend
npm install
```

إنشاء ملف `.env` من `.env.example`:
```
PORT=5000
JWT_SECRET=اكتب_سر_عشوائي_هنا
OPENAI_API_KEY=sk-...مفتاحك_من_openai...
DATABASE_URL=postgresql://user:password@localhost:5432/hubbmintaraf
NODE_ENV=development
```

```bash
npm run dev
```

### 2. الفرونتاند

```bash
cd frontend
npm install
npm start
```

---

## 📁 هيكل المشروع

```
HubbMinTaraf/
├── backend/
│   └── src/
│       ├── index.js          # نقطة الدخول
│       ├── routes/           # المسارات
│       ├── controllers/      # المنطق
│       ├── middleware/       # Auth middleware
│       └── models/           # قاعدة البيانات
└── frontend/
    └── src/
        ├── App.js            # الروتينج
        ├── context/          # Auth Context
        └── pages/            # الصفحات
            ├── Home.js       # الصفحة الرئيسية
            ├── Login.js      # تسجيل الدخول
            ├── Register.js   # التسجيل
            └── Chat.js       # الشات الرئيسي
```

---

## ✨ الميزات

- 💬 **شات عام** - محادثة عادية مع "قلبي"
- 🎭 **روليبلاي** - قلبي يلعب دور شريكك العاطفي
- 💡 **نصائح** - نصائح للحب والعلاقات
- 🌐 **4 لغات** - دارجة، عربية، فرنسية، إنجليزية
- 🔐 **Auth** - تسجيل + دخول + JWT
- 💾 **تاريخ** - كيحفظ المحادثات في قاعدة البيانات

---

## 🔑 مفاتيح مهمة

- **OpenAI API**: https://platform.openai.com/api-keys
- **PostgreSQL**: خاصك تثبت PostgreSQL محلياً أو تستخدم Railway

---

## 💙 HubbMinTaraf © 2024
