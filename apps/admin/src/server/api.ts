// Server-only API helper. Uses API_INTERNAL_BASE_URL + admin session; no browser tokens.
export const API_INTERNAL_BASE_URL = process.env['API_INTERNAL_BASE_URL'] ?? 'http://localhost:8080';
