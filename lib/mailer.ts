import nodemailer, { type Transporter } from "nodemailer"

/**
 * Service d'envoi unique du site (SMTP via nodemailer).
 *
 * Variables d'environnement :
 * - SMTP_HOST, SMTP_PORT (465 = SSL, sinon STARTTLS), SMTP_USER, SMTP_PASS
 * - SMTP_FROM (optionnel) : expéditeur affiché. Avec Gmail, il doit
 *   correspondre au compte authentifié. Défaut : "Les EGC <SMTP_USER>".
 */

let transporter: Transporter | null = null

export function isMailerConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export function getMailFrom(): string {
  return process.env.SMTP_FROM || `Les EGC <${process.env.SMTP_USER}>`
}

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number.parseInt(process.env.SMTP_PORT || "587", 10)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

export interface MailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/** Envoie un email. Lève une erreur si l'envoi échoue. */
export async function sendMail({ to, subject, html, replyTo }: MailOptions): Promise<string> {
  const info = await getTransporter().sendMail({
    from: getMailFrom(),
    to,
    replyTo,
    // Empêche toute injection d'en-tête via le sujet
    subject: subject.replace(/[\r\n]+/g, " "),
    html,
  })
  return info.messageId
}
