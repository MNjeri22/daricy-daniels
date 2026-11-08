declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    COMMERCE_MODE?: string;
    COMMERCE_BRIDGE_SECRET?: string;
    CUSTOMER_APP_ORIGIN?: string;
    RESEND_API_KEY?: string;
    NEWSLETTER_MODE?: string;
    NEWSLETTER_EMAIL_FROM?: string;
    NEWSLETTER_SEGMENT_ID?: string;
    CUSTOMER_EMAIL_FROM?: string;
    MEDUSA_BACKEND_URL?: string;
    MEDUSA_PUBLISHABLE_KEY?: string;
    STORE_OWNER_EMAIL?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    SANITY_PROJECT_ID?: string;
    TRANSACTIONAL_EMAIL_PROVIDER?: string;
    BUCKET?: R2Bucket;
  }
}
