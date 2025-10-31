<?php
header('Content-Type: application/json');
require 'connect.php';

$stmt = $pdo->query("SELECT * FROM produits");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($products);
?>