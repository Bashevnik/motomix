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
4. Відкрийте `/admin`, увійдіть і в розділі **Налаштування** вставте token.

Token зберігається тільки у `sessionStorage` поточної вкладки. Він не записується в код сайту, GitHub або Vercel. Після закриття вкладки його потрібно вставити знову.

Панель записує лише `catalog-overrides.js` та нові файли в `assets/admin/`. Це свідомо обмежує доступ: вона не може змінити інші файли проєкту.

## Облікові дані та безпека

Початкові облікові дані власник отримує окремо. Для production рекомендовано замінити їх у Vercel Environment Variables:

- `MOTOMIX_ADMIN_USER` — новий логін;
- `MOTOMIX_ADMIN_PASSWORD_SCRYPT` — scrypt-хеш нового пароля;
- необов'язково: `MOTOMIX_GITHUB_REPO` і `MOTOMIX_GITHUB_BRANCH`.

Для створення хешу на комп'ютері з Node.js:

```powershell
node -e "console.log(require('crypto').scryptSync('ВАШ_НОВИЙ_ПАРОЛЬ','motomix-admin-v1',64).toString('hex'))"
```

Після зміни Environment Variables зробіть Redeploy у Vercel.
