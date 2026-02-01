/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOWNLOAD_URL_HARBOR_HOPES?: string;
  readonly VITE_DOWNLOAD_URL_ETHICAL_ALGORITHM?: string;
  readonly VITE_DOWNLOAD_URL_SACRED_SIGNALS?: string;
  readonly VITE_DOWNLOAD_URL_FRACTURED_FOUNDATIONS?: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
