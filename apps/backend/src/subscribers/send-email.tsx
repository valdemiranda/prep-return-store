import * as React from "react";
import { renderEmail } from "../email-templates/render-email";

type SendEmailInput = {
  container: any;
  to: string;
  subject: string;
  template: React.ReactElement;
};

export async function sendEmail({
  container,
  to,
  subject,
  template,
}: SendEmailInput) {
  if (!to) {
    return;
  }

  const notificationModule = container.resolve("notification");
  const html = renderEmail(template);

  await notificationModule.createNotifications({
    to,
    channel: "email",
    content: {
      subject,
      html,
    },
  });
}
