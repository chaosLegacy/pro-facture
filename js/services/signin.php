<?php
include 'connexion.php';

$key = 'bob';
$header = [
    'typ' => 'JWT',
    'alg' => 'HS256'
];
$payload = [
  "iss" => "scotch.io",
  "exp"=> 1300819380,
  "name"=> "Chris Sevilleja",
  "admin"=> true
];
$header = json_encode($header);
$header = base64_encode($header);
console.log($header);
$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$password = $data->password;

//---- inscription
//$q = "INSERT INTO users(email, password) VALUES(:email, :password)";
//$query = $db->prepare($q);
//$execute = $query->execute(array(
//   ':email' => $email,
//   ':password' => $password,
//));

//---- connexion
$q = $db->query("SELECT email FROM users WHERE email = '$email' AND password = '$password' ");
$data = $q->fetchAll();

echo json_encode($data);
?>

