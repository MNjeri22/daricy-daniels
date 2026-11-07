declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    MEDUSA_BACKEND_URL?: string;
    MEDUSA_PUBLISHABLE_KEY?: string;
    STORE_OWNER_EMAIL?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    SANITY_PROJECT_ID?: string;
    TRANSACTIONAL_EMAIL_PROVIDER?: string;
    BUCKET?: R2Bucket;
  }
}
