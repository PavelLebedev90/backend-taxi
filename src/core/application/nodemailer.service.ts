import mjml2html from "mjml";
import nodemailer, { Mail } from "nodemailer";
import { SMTPTransportOptions } from "nodemailer";
import { SMTPSentMessageInfo } from "nodemailer";
import { SMTP_PASS, SMTP_USER } from "../../settings/config";

const PROVIDERS = {
  gmail: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
  },
  mailru: {
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // SSL
  },
};

async function renderWelcome(name: string, code: string) {
  const { html } = await mjml2html(`
    <mjml>
      <mj-body background-color="#f4f4f4">
        <mj-section background-color="#ffffff" padding="24px">
          <mj-column>
            <mj-text font-size="22px" font-weight="bold">Привет, ${name}!</mj-text>
            <mj-text font-size="16px" line-height="1.5">
              Спасибо за регистрацию. Подтвердите почту, нажав на кнопку ниже.
            </mj-text>
            <mj-button background-color="#4f46e5" href="https://example.com/confirm?code=${code}">
              Подтвердить
            </mj-button>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);
  return html;
}

const providerName = "gmail";

let transporter: Mail<SMTPSentMessageInfo, SMTPTransportOptions> | undefined;
export const nodemailerService = {
  createTransport() {
    if (transporter) {
      return;
    }
    transporter = nodemailer.createTransport({
      ...PROVIDERS.gmail,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  },
  async verifyMailer() {
    try {
      await transporter?.verify();
      console.log(`SMTP (${providerName}) готов к отправке`);
    } catch (err) {
      console.error(`Ошибка подключения к SMTP (${providerName}):`, err);
    }
  },
  async sendWelcome(to: string, name: string, code: string) {
    return transporter?.sendMail({
      from: `Taxi <${SMTP_USER}>`,
      to,
      subject: "Добро пожаловать в сервис Taxi",
      text: `Привет, ${name}! Подтвердите почту: https://example.com/confirm`,
      html: await renderWelcome(name, code),
    });
  },
};
