try {

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'maxebina@gmail.com';
    $mail->Password = 'vwtv peed tjro ibsg';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail->setFrom(
        'maxebina@gmail.com',
        'Portfolio Max'
    );

    $mail->addAddress(
        'maxebina@gmail.com'
    );

    $mail->isHTML(true);

    $mail->Subject = 'Teste';

    $mail->Body = 'Teste';

    echo "ANTES SEND<br>";

    $mail->send();

    echo "DEPOIS SEND<br>";

} catch (Exception $e) {

    echo "ERRO:<br>";
    echo $mail->ErrorInfo;
}