<?php

echo "PASSOU 1<br>";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

echo "PASSOU 2<br>";

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

echo "PASSOU 3<br>";

$mail = new PHPMailer(true);

echo "PASSOU 4<br>";