# Authorization System

یک API بک‌اند با **Node.js** و **Express** برای ثبت‌نام، ورود و احراز هویت کاربران با **JWT**. این پروژه بخشی از مسیر یادگیری Backend است و مفاهیم احراز هویت (Authentication) و محافظت از مسیرها را پیاده‌سازی می‌کند.

---

## ویژگی‌ها

- ثبت‌نام کاربر جدید با هش کردن رمز عبور (`bcrypt`)
- ورود کاربر و دریافت توکن JWT
- محافظت از مسیرهای خصوصی با middleware احراز هویت
- دریافت پروفایل کاربر لاگین‌شده
- ذخیره‌سازی کاربران در MongoDB با Mongoose
- مدیریت متمرکز خطاها (404 و خطاهای سرور)

---

## تکنولوژی‌ها

| تکنولوژی | کاربرد |
|----------|--------|
| [Node.js](https://nodejs.org/) | محیط اجرای JavaScript |
| [Express 5](https://expressjs.com/) | فریم‌ورک وب |
| [MongoDB](https://www.mongodb.com/) | پایگاه داده NoSQL |
| [Mongoose](https://mongoosejs.com/) | ODM برای MongoDB |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | هش کردن رمز عبور |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | تولید و اعتبارسنجی JWT |

---

## ساختار پروژه

```
5-Authorization-System/
├── app.js                      # نقطه ورود اپلیکیشن
├── controller/
│   ├── auth.controller.js      # منطق ثبت‌نام و ورود
│   └── profile.controller.js   # منطق پروفایل کاربر
├── middleware/
│   └── check-auth.js           # بررسی توکن JWT
├── model/
│   └── user.model.js           # اسکیمای کاربر
├── router/
│   ├── index.routes.js         # تجمیع مسیرها
│   ├── auth.routes.js          # مسیرهای احراز هویت
│   └── profile.routes.js       # مسیرهای پروفایل
├── utils/
│   ├── auth.util.js            # توابع هش، مقایسه رمز و JWT
│   └── error-handling.js       # مدیریت خطا
└── package.json
```

---

## پیش‌نیازها

قبل از اجرای پروژه، موارد زیر باید روی سیستم نصب باشند:

1. **Node.js** (نسخه 18 یا بالاتر توصیه می‌شود)
2. **MongoDB** در حال اجرا روی `localhost:27017`
3. **npm** (همراه با Node.js)

---

## نصب و راه‌اندازی

### ۱. کلون کردن مخزن

```bash
git clone <repository-url>
cd 5-Authorization-System
```

### ۲. نصب وابستگی‌ها

```bash
npm install
```

### ۳. اطمینان از اجرای MongoDB

MongoDB باید در حال اجرا باشد. اتصال پیش‌فرض در `app.js`:

```
mongodb://localhost:27017/authorization-system
```

پایگاه داده `authorization-system` به‌صورت خودکار ساخته می‌شود.

---

## اجرای سرور

```bash
npm start
```

سرور روی آدرس زیر اجرا می‌شود:

```
http://localhost:3000
```

برای توسعه با ری‌استارت خودکار (با nodemon):

```bash
npx nodemon app.js
```

---

## API Endpoints

پایه URL: `http://localhost:3000`

### ثبت‌نام

| مورد | مقدار |
|------|-------|
| **Method** | `POST` |
| **URL** | `/auth/register` |
| **Auth** | نیاز ندارد |

**Body (JSON):**

```json
{
  "fullName": "علی محمدی",
  "email": "ali@example.com",
  "password": "123456"
}
```

**پاسخ موفق (200):** اطلاعات کاربر ایجادشده (بدون رمز عبور در خروجی مستقیم نیست، اما فیلد password هش‌شده در دیتابیس ذخیره می‌شود)

**خطاهای احتمالی:**

| statusCode | توضیح |
|------------|-------|
| `500` | ایمیل تکراری یا خطای سرور |

---

### ورود

| مورد | مقدار |
|------|-------|
| **Method** | `POST` |
| **URL** | `/auth/login` |
| **Auth** | نیاز ندارد |

**Body (JSON):**

```json
{
  "email": "ali@example.com",
  "password": "123456"
}
```

**پاسخ موفق (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "login successfully"
}
```

**خطاهای احتمالی:**

| statusCode | message |
|------------|---------|
| `404` | `not found user` |
| `401` | `email or password is incorrect` |

---

### دریافت پروفایل

| مورد | مقدار |
|------|-------|
| **Method** | `GET` |
| **URL** | `/user/profile` |
| **Auth** | **Bearer Token** (الزامی) |

**Header:**

```
Authorization: Bearer <token>
```

**پاسخ موفق (200):**

```json
{
  "fullName": "علی محمدی",
  "email": "ali@example.com"
}
```

**خطاهای احتمالی:**

| statusCode | message |
|------------|---------|
| `401` | `authorization failed, please again` |
| `401` | `not found user account, login again` |

---

## احراز هویت (JWT)

جریان احراز هویت به این صورت است:

```
1. کاربر ثبت‌نام می‌کند  →  POST /auth/register
2. کاربر وارد می‌شود     →  POST /auth/login  →  دریافت token
3. در درخواست‌های بعدی  →  Header: Authorization: Bearer <token>
4. middleware checkAuth  →  اعتبارسنجی توکن و بارگذاری req.user
```

توکن JWT شامل `id` و `email` کاربر است و پس از ورود موفق صادر می‌شود.

مسیر `/user/*` همگی توسط middleware `checkAuth` محافظت می‌شوند.

---

## مدل داده کاربر

| فیلد | نوع | توضیح |
|------|-----|-------|
| `fullName` | String | نام کامل (الزامی) |
| `email` | String | ایمیل یکتا (الزامی) |
| `password` | String | رمز عبور هش‌شده (الزامی) |
| `createdAt` | Date | زمان ایجاد (خودکار) |
| `updatedAt` | Date | زمان به‌روزرسانی (خودکار) |

---

## مدیریت خطا

| وضعیت | رفتار |
|-------|-------|
| مسیر نامعتبر | `{ statusCode: 404, message: "NotFound Page" }` |
| خطای اپلیکیشن | `{ statusCode: <کد>, message: "<پیام>" }` |
| خطای داخلی | `{ statusCode: 500, message: "internalServerError" }` |

---

## نمونه درخواست با cURL

### ثبت‌نام

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Ali Mohammadi\",\"email\":\"ali@example.com\",\"password\":\"123456\"}"
```

### ورود

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ali@example.com\",\"password\":\"123456\"}"
```

### دریافت پروفایل

```bash
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## نکات توسعه

- **رمز JWT:** در فایل `utils/auth.util.js` به‌صورت ثابت تعریف شده است. در محیط production باید از متغیر محیطی (مثلاً `process.env.JWT_SECRET`) استفاده شود.
- **اتصال MongoDB:** آدرس دیتابیس در `app.js` هاردکد شده است. برای production از فایل `.env` استفاده کنید.
- **رمز عبور در پاسخ register:** در پاسخ ثبت‌نام، شیء کامل کاربر (شامل password هش‌شده) برگردانده می‌شود. در نسخه production بهتر است password از خروجی حذف شود.

---
