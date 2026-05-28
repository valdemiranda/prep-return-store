import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const redisUrl = process.env.REDIS_URL;
const r2FileModule =
  process.env.CLOUDFLARE_R2_BUCKET &&
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
  process.env.CLOUDFLARE_R2_ENDPOINT &&
  process.env.CLOUDFLARE_R2_FILE_URL
    ? [
        {
          resolve: "@medusajs/medusa/file",
          options: {
            providers: [
              {
                resolve: "@medusajs/medusa/file-s3",
                id: "s3",
                options: {
                  file_url: process.env.CLOUDFLARE_R2_FILE_URL,
                  access_key_id: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
                  secret_access_key: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
                  region: process.env.CLOUDFLARE_R2_REGION || "auto",
                  bucket: process.env.CLOUDFLARE_R2_BUCKET,
                  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
                  additional_client_config: {
                    forcePathStyle:
                      process.env.CLOUDFLARE_R2_FORCE_PATH_STYLE !== "false",
                  },
                },
              },
            ],
          },
        },
      ]
    : [];

module.exports = defineConfig({
  admin: {
    vite: () => {
      return {
        server: {
          allowedHosts: ["dev-vps"],
        },
      };
    },
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "./src/modules/store-content",
    },
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/caching-redis",
            id: "caching-redis",
            is_default: true,
            options: {
              redisUrl,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY!,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: process.env.STRIPE_CAPTURE === "true",
              automatic_payment_methods:
                process.env.STRIPE_AUTOMATIC_PAYMENT_METHODS === "true",
            },
          },
        ],
      },
    },
    ...r2FileModule,
  ],
});
