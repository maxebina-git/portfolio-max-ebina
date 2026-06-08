<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

/* =========================
   VALIDAÇÃO DOS DADOS
========================= */

$nome = isset($_POST['nome']) ? htmlspecialchars($_POST['nome']) : '';

$emailPostRaw = isset($_POST['email']) ? $_POST['email'] : '';
$emailPost = filter_var($emailPostRaw, FILTER_VALIDATE_EMAIL);

if (!$emailPost) {
    exit;
}

$telefone = isset($_POST['telefone']) ? htmlspecialchars($_POST['telefone']) : '';
$assunto = isset($_POST['assunto']) ? htmlspecialchars($_POST['assunto']) : '';
$mensagem = isset($_POST['mensagem']) ? htmlspecialchars($_POST['mensagem']) : '';

/* =========================
   CONFIG PHPMailer
========================= */

$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'maxebina@gmail.com';
$mail->Password = 'vwtv peed tjro ibsg';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';

/* =========================
   REMETENTE / DESTINO
========================= */

$mail->setFrom('maxebina@gmail.com', 'Portfolio Max');

$mail->addAddress('maxebina@gmail.com');

$mail->Sender = 'maxebina@gmail.com';

$mail->addReplyTo($emailPost, $nome);

/* =========================
   EMAIL
========================= */

$mail->isHTML(true);

$mail->Subject = mb_encode_mimeheader(
    'Novo contato do portfólio',
    'UTF-8'
);

$mail->Body = '
<div style="background:#f6f7fb;padding:40px 0;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#111827;padding:20px 30px;color:#ffffff;">
      <h2 style="margin:0;font-size:18px;">Novo contato do portfólio</h2>
      <p style="margin:5px 0 0;font-size:12px;opacity:0.8;">Formulário do site maxebina.com.br</p>
    </div>

    <!-- Body -->
    <div style="padding:30px;color:#111827;">

      <div style="margin-bottom:15px;">
        <strong>Nome:</strong><br>
        <span style="color:#374151;">' . htmlspecialchars($nome) . '</span>
      </div>

      <div style="margin-bottom:15px;">
        <strong>Email:</strong><br>
        <span style="color:#374151;">' . htmlspecialchars($emailPost) . '</span>
      </div>

      <div style="margin-bottom:15px;">
        <strong>Telefone:</strong><br>
        <span style="color:#374151;">' . htmlspecialchars($telefone) . '</span>
      </div>

      <div style="margin-bottom:15px;">
        <strong>Assunto:</strong><br>
        <span style="color:#374151;">' . htmlspecialchars($assunto) . '</span>
      </div>

      <div style="margin-top:25px;">
        <strong>Mensagem:</strong>
        <div style="margin-top:8px;padding:15px;background:#f3f4f6;border-radius:10px;line-height:1.5;color:#374151;">
          ' . nl2br(htmlspecialchars($mensagem)) . '
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding:15px 30px;background:#f9fafb;font-size:11px;color:#6b7280;">
      Enviado automaticamente pelo formulário de contato.
    </div>

  </div>
</div>
';

/* =========================
   ENVIO
========================= */

try {

    $mail->send();

    header("Location: /#conectar");
    exit;

} catch (\Throwable $e) {

    echo "ERRO AO ENVIAR MENSAGEM:<br>";
    echo $mail->ErrorInfo;
    exit;

}