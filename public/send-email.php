<?php

echo "PHP OK<br>";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

echo "PHPMailer OK<br>";

$mail = new PHPMailer(true);

$mail->isSMTP();

echo "SMTP OK<br>";

exit;