# Deployment checklist

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL` uses HTTPS
- Database credentials are injected through environment variables
- `SUPER_ADMIN_PASSWORD` is configured outside source control
- `SESSION_DRIVER=database` and sessions table are migrated
- `php artisan migrate --force`
- `php artisan storage:link`
- `npm run build`
- Queue worker and scheduler are running
- Logs are rotated and backups are tested
- Security headers, HTTPS, and secure cookies are enabled at the web server
- `/up` is used as the framework health endpoint
