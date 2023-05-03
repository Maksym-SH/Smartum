/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly VITE_APP_API_KEY: string;
  readonly VITE_APP_AUTH_DOMAIN: string;
  readonly VITE_APP_PROJECT_ID: string;
  readonly VITE_APP_STORAGE_BUCKET: string;
  readonly VITE_APP_MESSAGING_SENDER_ID: string;
  readonly VITE_APP_ID: string;
  readonly VITE_APP_MEASUREMENT_ID: string;
  readonly VITE_APP_DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
