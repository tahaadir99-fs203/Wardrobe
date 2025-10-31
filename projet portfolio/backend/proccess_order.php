<?php
header('Content-Type: application/json');
require 'connect.php';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $fullname = $_POST['fullname'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $cart = json_decode($_POST['cart'] ?? '[]', true);

    if(!$fullname || !$email || !$address || empty($cart)){
        echo json_encode(['success'=>false,'error'=>'Champs manquants']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO commandes (fullname,email,address,cart) VALUES (?,?,?,?)");
    $stmt->execute([$fullname,$email,$address,json_encode($cart)]);

    echo json_encode(['success'=>true,'order_id'=>$pdo->lastInsertId()]);
}
?>