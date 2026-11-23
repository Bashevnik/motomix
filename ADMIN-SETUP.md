# Адмін-панель MOTOMIX

Адреса панелі: `/admin`.

## Що можна робити

- переглядати та шукати товари;
- створювати, редагувати й приховувати товари;
- завантажувати фотографії JPG, PNG або WEBP до 3 МБ;
- створювати, редагувати й приховувати категорії;
- переглядати заявки, що надходять через наявну інтеграцію сайту.

## Одноразове підключення публікації

Панель зберігає зміни в GitHub, а Vercel автоматично публікує нову версію сайту.

1. У GitHub відкрийте **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Створіть token лише для репозиторію `Bashevnik/motomix`.
3. У **Repository permissions** виберіть `Contents: Read and write`.
4. У Vercel відкрийте **Project Settings → Environment Variables** та створіть змінну `MOTOMIX_GITHUB_TOKEN` зі значенням цього token для Production, Preview і Development.
5. Зробіть **Redeploy** проєкту у Vercel.

Token зберігається у Vercel Environment Variables і ніколи не показується в адмін-панелі, браузері або репозиторії. Після одноразового налаштування менеджери працюють з панеллю без token.

Панель записує лише `catalog-overrides.js` та нові файли в `assets/admin/`. Це свідомо обмежує доступ: вона не може змінити інші файли проєкту.

## Облікові дані та безпека

Початкові облікові дані власник отримує окремо. Для production рекомендовано замінити їх у Vercel Environment Variables:

- `MOTOMIX_GITHUB_TOKEN` — fine-grained token GitHub для запису каталогу;
- `MOTOMIX_ADMIN_USER` — новий логін;
- `MOTOMIX_ADMIN_PASSWORD_SCRYPT` — scrypt-хеш нового пароля;
- необов'язково: `MOTOMIX_GITHUB_REPO` і `MOTOMIX_GITHUB_BRANCH`.

Для створення хешу на комп'ютері з Node.js:

```powershell
node -e "console.log(require('crypto').scryptSync('ВАШ_НОВИЙ_ПАРОЛЬ','motomix-admin-v1',64).toString('hex'))"
```

Після зміни Environment Variables зробіть Redeploy у Vercel.
