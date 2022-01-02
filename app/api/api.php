<?php

//ob_start();
require_once("Rest.inc.php");
require './Autoloader.php';
spl_autoload_register(array('Autoloader', 'autoload'));

class API extends REST {

    public $data = "";

    const DB_SERVER = "localhost";
    const DB_USER = "root";
    const DB_PASSWORD = "root";
    const DB = "proFacture_db";

    protected $db = NULL;

    public function __construct() {
        parent::__construct($this->dbConnect());    // Init parent contructor
        $this->dbConnect();     // Initiate Database connection
    }

    //Database connection
    private function dbConnect() {
        try {
            $this->db = new PDO('mysql:host=' . self::DB_SERVER . ';dbname=' . self::DB.';charset=utf8', self::DB_USER, self::DB_PASSWORD);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        } catch (PDOException $e) {
            echo 'Connexion échouée : ' . $e->getMessage();
        }
    }

    /*
     * Public method for access api.
     * This method dynmically call the method based on the query string
     *
     */

    public function processApi() {
        $isAuthorized = false;
        $hasExpiredAccount = true;
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $needle = ';';
            $auth = explode(' ', $headers['Authorization']);
            $key = $auth[0] . " ";
            if (array_key_exists(1, $auth)) {
                $token = $auth[1];
                $data = aes128Decrypt($key, $token);

                $res = explode($needle, $data);

                $idSociete = $res[0];
                $login = $res[1];
                $password = $res[2];
                $ip = $res[3];

                try {
                    $sql_user = $this->db->prepare("SELECT idUser FROM user WHERE login = :login AND password = :password AND idSociete = :idSociete AND ip = :ip LIMIT 1");

                    $sql_user->bindParam('login', $login, PDO::PARAM_STR);
                    $sql_user->bindParam('password', $password, PDO::PARAM_STR);
                    $sql_user->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql_user->bindParam('ip', $ip, PDO::PARAM_STR);

                    $sql_user->execute();

                    if ($sql_user->rowCount() > 0) {
                        $isAuthorized = true;
                        $sql_soc = $this->db->prepare("SELECT idSociete, nomSoc, idabonnement FROM societe WHERE idSociete = :idSociete and not (idabonnement = 0 and (30  - ifnull(DATEDIFF(NOW(), dateCreation),0))<0) LIMIT 1");
                        $sql_soc->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                        $sql_soc->execute();
                        if ($sql_soc->rowCount() > 0) {
                            $hasExpiredAccount = false;
                        }
                    }
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage()); // If no records "No Content" status
                }
            }
        } else {
            $this->response('', 401);    // Unauthorized
        }

        $class = substr($_REQUEST['rquest'], 0, strrpos($_REQUEST['rquest'], '/'));

        $class_instance = new $class();

        $method = strtolower(trim(str_replace($class . "/", "", $_REQUEST['rquest'])));

        if (($isAuthorized && !$hasExpiredAccount) || ($method === 'getuser' || $method === 'adduser')) {
            if ((int) method_exists($class_instance, $method) > 0)
                $class_instance->$method();
            else
                $this->response('', 404);    // If the method not exist with in this class, response would be "Page not found".
        } else {
            if(!$isAuthorized)
                $this->response('', 401);    // Unauthorized
            if($hasExpiredAccount)
                $error = array('status' => "Failed", "msg" => "Votre compte à été expiré");
                $this->response($this->json($error), 400);
        }
    }

    /*
     * 	Encode array into JSON
     */

    protected function json($data) {
        if (is_array($data)) {
            return json_encode($data, JSON_UNESCAPED_UNICODE);
        }
    }

}

// Initiiate Library

$api = new API;
$api->processApi();

function aes128Decrypt($key, $data) {
    list($encrypted_data, $iv) = explode('::', base64_decode($data), 2);
    return openssl_decrypt($encrypted_data, 'aes-256-cbc', $key, 0, $iv);
}
?>

