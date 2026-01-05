import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validar campos requeridos
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Configurar el transporter de nodemailer
    // Nota: Necesitas configurar estas variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verificar que las credenciales SMTP estén configuradas
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { error: 'Error de configuración del servidor. Por favor, contacte al administrador.' },
        { status: 500 }
      );
    }

    // Función para escapar HTML y prevenir XSS
    const escapeHtml = (text: string): string => {
      const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    // Escapar los datos del usuario para prevenir XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Configurar el email
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'contact@tractorscompare.com',
      replyTo: email,
      subject: `Contacto desde TractorsCompare: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Asunto:</strong> ${safeSubject}</p>
          </div>
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto de TractorsCompare.</p>
            <p>Puedes responder directamente a este correo para contactar a ${safeName} (${safeEmail}).</p>
          </div>
        </div>
      `,
      text: `
Nuevo mensaje de contacto desde TractorsCompare

Nombre: ${name}
Email: ${email}
Asunto: ${subject}

Mensaje:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de TractorsCompare.
Puedes responder directamente a este correo para contactar a ${name} (${email}).
      `,
    };

    // Enviar el email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Mensaje enviado exitosamente. Te responderemos pronto.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.' },
      { status: 500 }
    );
  }
}

