export const TEMP_LOCK_ATTEMPTS = parseInt(process.env.TEMPORARY_PASSWORD_ATTEMPTS || '5', 10);
export const PERM_LOCK_ATTEMPTS = parseInt(process.env.PERMANENT_PASSWORD_ATTEMPTS || '15', 10);
export const TEMP_LOCK_MINUTES = parseInt(process.env.TEMPORARY_LOCKOUT_DURATION_MINUTES || '15', 10);
export const PERM_LOCK_MINUTES = parseInt(process.env.PERMANENT_LOCKOUT_DURATION_MINUTES || '35', 10);
