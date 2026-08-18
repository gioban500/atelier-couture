import nodemailer from 'nodemailer';

// Fonction de génération du transporteur à la volée
function getTransporter() {
  // Par défaut sur 465 (SSL) pour éviter le blocage du port 587 sur Render
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: smtpPort,
    secure: smtpPort === 465, // true si port 465, false sinon
    family: 4, // 👈 Forcer IPv4 pour contourner l'absence de route IPv6 sur Render
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // Évite que le serveur bloque indéfiniment si le SMTP met du temps
  });
}

export async function sendNewDevisNotificationToCouturier(devis) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ ERREUR SMTP: SMTP_USER ou SMTP_PASS manquant dans .env');
    return;
  }

  const transporter = getTransporter();
  const adminUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin`;
  // Sécurisation au cas où client_phone est vide ou indéfini
  const rawPhone = devis.client_phone || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #d97706; margin-bottom: 10px;">🎯 Nouveau devis reçu !</h2>
      <p style="color: #334155; font-size: 14px;">Un client vient de soumettre une nouvelle demande de devis sur le site.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; margin: 15px 0;">
        <p style="margin: 5px 0; font-size: 14px;"><strong>Client :</strong> ${devis.client_name || 'N/A'}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Téléphone :</strong> ${devis.client_phone || 'N/A'}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Email :</strong> ${devis.client_email || 'N/A'}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Prestation :</strong> ${devis.service_type || 'N/A'}</p>
        <p style="margin: 10px 0 5px 0; font-size: 14px;"><strong>Description :</strong></p>
        <p style="margin: 0; font-size: 13px; color: #475569; font-style: italic;">"${devis.description || ''}"</p>
      </div>

      <div style="margin-top: 20px;">
        ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}" style="background-color: #16a34a; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold; margin-right: 10px; display: inline-block;">💬 Contacter sur WhatsApp</a>` : ''}
        <a href="${adminUrl}" style="background-color: #0f172a; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">💻 Ouvrir le Back-Office</a>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.COUTURIER_EMAIL || process.env.SMTP_USER,
      subject: `🎯 Nouveau devis #${devis.id || ''} — ${devis.client_name || 'Client'}`,
      html: htmlContent,
    });
    console.log(`✉️ Notification devis envoyée au couturier`);
  } catch (error) {
    console.error('❌ Erreur d\'envoi notification couturier:', error);
  }
}

export async function sendClientConfirmationEmail(clientEmail, clientName) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  const transporter = getTransporter();
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a; margin-bottom: 10px;">Demande bien reçue ! ✨</h2>
      <p style="color: #334155; font-size: 14px;">Bonjour <strong>${clientName}</strong>,</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.5;">
        Nous avons bien reçu votre demande de devis. Notre atelier étudie votre projet et vous recontactera sous <strong>24 à 48 heures</strong>.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">Merci pour votre confiance,<br/>L'équipe Atelier Couture</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: clientEmail,
      subject: '✅ Réception de votre demande de devis — Atelier Couture',
      html: htmlContent,
    });
    console.log(`✉️ Confirmation envoyée au client (${clientEmail})`);
  } catch (error) {
    console.error('❌ Erreur d\'envoi confirmation client:', error);
  }
}

export async function sendResetPasswordEmail(toEmail, resetToken) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  const transporter = getTransporter();
  const baseUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a; margin-bottom: 10px; font-size: 20px;">Réinitialisation de mot de passe</h2>
      <p style="color: #475569; font-size: 14px;">Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #f59e0b; color: #0f172a; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
          Réinitialiser mon mot de passe
        </a>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: toEmail,
      subject: '🔑 Réinitialisation de votre mot de passe — Atelier Couture',
      html: htmlContent,
    });
    console.log(`✉️ Email de réinitialisation envoyé avec succès à ${toEmail}`);
  } catch (error) {
    console.error('❌ Erreur d\'envoi d\'email (Reset Password):', error);
  }
}