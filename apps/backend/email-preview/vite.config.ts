import { defineConfig } from "vite";
import React from "react";
import fs from "fs";
import path from "path";
import { renderEmail } from "../src/email-templates/render-email";

const templates = {
  "order-placed": "../src/email-templates/order-placed.tsx",
  "fulfillment-created": "../src/email-templates/fulfillment-created.tsx",
  "shipment-created": "../src/email-templates/shipment-created.tsx",
  "delivery-created": "../src/email-templates/delivery-created.tsx",
  "order-canceled": "../src/email-templates/order-canceled.tsx",
};

export default defineConfig({
  root: "email-preview",
  plugins: [
    {
      name: "email-preview-renderer",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const cleanUrl = req.url?.split("?")[0];
          if (cleanUrl === "/logo.png") {
            const logoPath = path.resolve(__dirname, "../../storefront/public/logo.png");
            if (fs.existsSync(logoPath)) {
              res.setHeader("Content-Type", "image/png");
              res.end(fs.readFileSync(logoPath));
              return;
            }
          }
          if (cleanUrl === "/logo.svg") {
            const logoPath = path.resolve(__dirname, "../../storefront/public/logo.svg");
            if (fs.existsSync(logoPath)) {
              res.setHeader("Content-Type", "image/svg+xml");
              res.end(fs.readFileSync(logoPath));
              return;
            }
          }
          next();
        });

        server.middlewares.use("/__email-preview", async (req, res) => {
          const url = new URL(req.url || "", "http://localhost");
          const id = url.searchParams.get("template") || "order-placed";
          const templatePath = templates[id as keyof typeof templates];

          if (!templatePath) {
            res.statusCode = 404;
            res.end("Template not found");
            return;
          }

          try {
            const mod = await server.ssrLoadModule(templatePath);
            const component = mod.default;
            res.setHeader("X-Email-Preview", "true");
            res.setHeader("X-Module-Exports", Object.keys(mod).join(","));

            if (typeof component !== "function") {
              throw new Error(
                `Template module did not export a component. Exports: ${Object.keys(mod).join(", ")}`
              );
            }

            const html = renderEmail(
              React.createElement(component, component.PreviewProps)
            );

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.setHeader("X-Html-Length", String(html.length));
            res.end(html);
          } catch (cause) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(cause instanceof Error ? cause.stack : String(cause));
          }
        });
      },
    },
  ],
  server: {
    host: "0.0.0.0",
    port: 3001,
    allowedHosts: ["dev-vps"],
  },
});
