# Installation

1. Install PHP 8.3+, Composer, Node.js, and SQLite/MySQL/PostgreSQL.
2. Run `composer install` inside `backend`.
3. Copy `.env.example` to `.env` and set the database plus Super Admin variables.
4. Run `php artisan key:generate`.
5. Run `php artisan migrate --seed`.
6. Run `npm install --include=optional` and `npm run build`.
7. Run `php artisan storage:link` if avatar uploads are enabled.
8. Start with `php artisan serve`.

For production, run the queue worker and scheduler using the deployment platform's process manager. Keep `APP_DEBUG=false`, use HTTPS, and never commit `.env`.
