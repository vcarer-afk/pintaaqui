import express from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Rota para envio real de e-mail de ativação via SMTP (Gmail, Outlook, Hostinger, etc.)
  app.post('/api/send-activation-email', async (req, res) => {
    try {
      const { email, nome, codigo, emailConfig } = req.body;

      if (!email || !codigo) {
        return res.status(400).json({ error: 'E-mail e código de ativação são obrigatórios.' });
      }

      const host = emailConfig?.host || 'smtp.gmail.com';
      const port = emailConfig?.porta || 587;
      const user = emailConfig?.remetenteEmail || emailConfig?.usuario || 'vcarer@gmail.com';
      const pass = emailConfig?.senhaApp || '';
      const fromName = emailConfig?.remetenteNome || 'Pinta Aqui - Portal de Pintores';

      // Se a senha de app ainda não foi informada nas configurações gerais
      if (!pass || pass.trim() === '') {
        return res.status(200).json({
          success: true,
          simulated: true,
          message: `Código [${codigo}] gerado com sucesso para ${email}! (Para envio automático direto por SMTP, configure a senha de app em 'Configurações Gerais').`
        });
      }

      const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: {
          user,
          pass: pass.replace(/\s+/g, '') // remove espaços se o usuário colou com espaço (como no Google)
        }
      });

      const mailOptions = {
        from: `"${fromName}" <${user}>`,
        to: email,
        subject: `Código de Ativação do Pintor: ${codigo} - Portal Pinta Aqui`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b;">
            <div style="background-color: #ea580c; padding: 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">PINTA AQUI</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Portal Oficial do Pintor Profissional</p>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Olá, ${nome || 'Pintor Parceiro'}!</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                Recebemos seu cadastro profissional no <strong>Pinta Aqui</strong>. Para ativar seu cadastro e prosseguir com a liberação na vitrine, utilize o seu código exclusivo de 4 dígitos:
              </p>
              
              <div style="background-color: #fff7ed; border: 2px dashed #ea580c; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #c2410c; letter-spacing: 1px; display: block; margin-bottom: 8px;">Sua Senha de Ativação</span>
                <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ea580c; font-family: monospace;">${codigo}</span>
              </div>

              <div style="background-color: #f8fafc; border-left: 4px solid #004b8d; padding: 14px 16px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #334155;">
                <strong>Como funciona a ativação:</strong>
                <ol style="margin: 8px 0 0 0; padding-left: 18px; line-height: 1.5;">
                  <li>Seu perfil será avaliado e liberado pela supervisão técnica do <strong>Vlademir Carer</strong>.</li>
                  <li>No site, acesse "Área do Pintor" e digite este código de 4 dígitos para validar seu e-mail.</li>
                  <li>Pronto! Seu Cartão de Visitas Digital estará disponível para clientes entrarem em contato pelo WhatsApp.</li>
                </ol>
              </div>

              <p style="font-size: 12px; color: #94a3b8; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                Se você não solicitou este cadastro, por favor desconsidere este e-mail.
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      return res.json({
        success: true,
        message: `E-mail com código de 4 dígitos enviado com sucesso para ${email}!`
      });
    } catch (err: any) {
      console.error('Erro ao disparar email via SMTP:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Erro ao conectar com servidor SMTP. Verifique a senha de app e host.'
      });
    }
  });

  // Rota para testar conexão SMTP
  app.post('/api/test-smtp', async (req, res) => {
    try {
      const { emailConfig, emailTeste } = req.body;
      const host = emailConfig?.host || 'smtp.gmail.com';
      const port = emailConfig?.porta || 587;
      const user = emailConfig?.remetenteEmail || emailConfig?.usuario || '';
      const pass = emailConfig?.senhaApp || '';

      if (!pass) {
        return res.status(400).json({ error: 'Informe a senha de app do e-mail para testar.' });
      }

      const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: {
          user,
          pass: pass.replace(/\s+/g, '')
        }
      });

      await transporter.verify();

      if (emailTeste) {
        await transporter.sendMail({
          from: `"${emailConfig?.remetenteNome || 'Pinta Aqui'}" <${user}>`,
          to: emailTeste,
          subject: 'Teste de Configuração de E-mail - Pinta Aqui',
          text: 'Parabéns! Sua configuração de e-mail e senha de app no Pinta Aqui está funcionando perfeitamente!'
        });
      }

      return res.json({ success: true, message: 'Servidor SMTP autenticado e pronto para envio!' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Configuração Vite Dev Middleware ou Arquivos Estáticos em Produção
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Pinta Aqui rodando em http://localhost:${PORT}`);
  });
}

startServer();
