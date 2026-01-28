/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPAL_CLIENT_ID: string;
  readonly VITE_DOWNLOAD_URL_HARBOR_HOPES: string;
  readonly VITE_DOWNLOAD_URL_ETHICAL_ALGORITHM: string;
  readonly VITE_DOWNLOAD_URL_SACRED_SIGNALS: string;
  readonly VITE_DOWNLOAD_URL_FRACTURED_FOUNDATIONS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
