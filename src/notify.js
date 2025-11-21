/**
 * Notification Service (Phase 7)
 * Uses nodemailer for email notifications (configurable SMTP via env vars).
 */
'use strict';

const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025', 10),
      secure: false,
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined,
      tls: { rejectUnauthorized: false }
    });
  }

  async sendBookingConfirmation({ to, subject, text }) {
    if (!to) throw new Error('Recipient required');
    return this.transporter.sendMail({
      from: process.env.MAIL_FROM || 'scheduler@example.com',
      to,
      subject: subject || 'Booking Confirmation',
      text: text || 'Your booking has been confirmed.'
    });
  }
}

module.exports = NotificationService;
