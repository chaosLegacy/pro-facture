<?php

class Client extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }

    public function valid_token($token) {
        $sql = $this->db->query("SELECT * FROM access_token WHERE token = :token");
        $sql->bindParam('token', $token, PDO::PARAM_STR);
        if ($sql->rowCount() > 0) {
            $result = $sql->fetch();
            
            return 1;
        }
        else {
            return 0;
        }
    }

    public function GetAllClients() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $sql = $this->db->query("SELECT * FROM client");
        if ($sql->rowCount() > 0) {
            $result = array();
            while ($rlt = $sql->fetchAll()) {
                $result[] = $rlt;
            }
            // If success everythig is good send header as "OK" and return list of users in JSON format
            $this->response($this->json($result), 200);
        }
        $this->response('', 204); // If no records "No Content" status
    }

    public function GetClient() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $reference = $_REQUEST['data']["reference"];
            // Input validations
            if (!empty($reference)) {
                $sql = $this->db->query("SELECT * FROM client WHERE reference = '$reference' LIMIT 1");
                if ($sql->rowCount() > 0) {
                    $result = $sql->fetch();

                    // If success everythig is good send header as "OK" and user details
                    $this->response($this->json($result), 200);
                }
                $this->response('', 204); // If no records "No Content" status
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function InsertClient() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idClient = $_REQUEST['data']['idClient'];
            $reference = $_REQUEST['data']['reference'];
            $nom = $_REQUEST['data']['nom'];
            $idType = $_REQUEST['data']['idType'];
            $tel = $_REQUEST['data']['tel'];
            $fax = $_REQUEST['data']['fax'];
            $email = $_REQUEST['data']['email'];
            $rueF = $_REQUEST['data']['rueF'];
            $villeF = $_REQUEST['data']['villeF'];
            $codePF = $_REQUEST['data']['codePF'];
            $paysF = $_REQUEST['data']['paysF'];
            $rueL = $_REQUEST['data']['rueL'];
            $villeL = $_REQUEST['data']['villeL'];
            $codePL = $_REQUEST['data']['codePL'];
            $paysL = $_REQUEST['data']['paysL'];

            // Input validations
            if (!empty($idClient) && !empty($reference)) {

                try {
                    $sql = $this->db->prepare("INSERT INTO client (idClient, idType, reference, nom, tel, fax, email, rueL,"
                            . " villeL, paysL, codePL, rueF, villeF, paysF, codePF, photo)"
                            . "VALUES(:idClient, :idType, :reference, :nom, :tel, :fax, :email, :rueL, :villeL, :paysL, :codePL,"
                            . ":rueF, :villeF, :paysF, :codePF, '')");

                    $sql->bindParam('idClient', $idClient, PDO::PARAM_STR);
                    $sql->bindParam('idType', $idType, PDO::PARAM_STR);
                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql->bindParam('nom', $nom, PDO::PARAM_STR);
                    $sql->bindParam('tel', $tel, PDO::PARAM_STR);
                    $sql->bindParam('fax', $fax, PDO::PARAM_STR);
                    $sql->bindParam('email', $email, PDO::PARAM_STR);
                    $sql->bindParam('rueL', $rueL, PDO::PARAM_STR);
                    $sql->bindParam('villeL', $villeL, PDO::PARAM_STR);
                    $sql->bindParam('paysL', $paysL, PDO::PARAM_STR);
                    $sql->bindParam('codePL', $codePL, PDO::PARAM_STR);
                    $sql->bindParam('rueF', $rueF, PDO::PARAM_STR);
                    $sql->bindParam('villeF', $villeF, PDO::PARAM_STR);
                    $sql->bindParam('paysF', $paysF, PDO::PARAM_STR);
                    $sql->bindParam('codePF', $codePF, PDO::PARAM_STR);

                    $sql->execute();

                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully inserted");
                        $this->response($this->json($success), 200);
                    }
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage()); // If no records "No Content" status
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function UpdateClient() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idClient = $_REQUEST['data']['idClient'];
            $reference = $_REQUEST['data']['reference'];
            $nom = $_REQUEST['data']['nom'];
            $idType = $_REQUEST['data']['idType'];
            $tel = $_REQUEST['data']['tel'];
            $fax = $_REQUEST['data']['fax'];
            $email = $_REQUEST['data']['email'];
            $rueF = $_REQUEST['data']['rueF'];
            $villeF = $_REQUEST['data']['villeF'];
            $codePF = $_REQUEST['data']['codePF'];
            $paysF = $_REQUEST['data']['paysF'];
            $rueL = $_REQUEST['data']['rueL'];
            $villeL = $_REQUEST['data']['villeL'];
            $codePL = $_REQUEST['data']['codePL'];
            $paysL = $_REQUEST['data']['paysL'];

            // Input validations
            if (!empty($idClient) && !empty($reference)) {

                try {
                    $sql = $this->db->prepare("UPDATE client SET idType = :idType , nom = :nom, tel = :tel, fax = :fax, email = :email, rueL = :rueL,"
                            . " villeL = :villeL, paysL = :paysL, codePL = :codePL , rueF = :rueF, villeF = :villeF, paysF = :paysF, codePF = :codePF, photo = '' "
                            . "WHERE reference = :reference");

                    $sql->bindParam('idType', $idType, PDO::PARAM_STR);
                    $sql->bindParam('nom', $nom, PDO::PARAM_STR);
                    $sql->bindParam('tel', $tel, PDO::PARAM_STR);
                    $sql->bindParam('fax', $fax, PDO::PARAM_STR);
                    $sql->bindParam('email', $email, PDO::PARAM_STR);
                    $sql->bindParam('rueL', $rueL, PDO::PARAM_STR);
                    $sql->bindParam('villeL', $villeL, PDO::PARAM_STR);
                    $sql->bindParam('paysL', $paysL, PDO::PARAM_STR);
                    $sql->bindParam('codePL', $codePL, PDO::PARAM_STR);
                    $sql->bindParam('rueF', $rueF, PDO::PARAM_STR);
                    $sql->bindParam('villeF', $villeF, PDO::PARAM_STR);
                    $sql->bindParam('paysF', $paysF, PDO::PARAM_STR);
                    $sql->bindParam('codePF', $codePF, PDO::PARAM_STR);
                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);

                    $sql->execute();

                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully updated");
                        $this->response($this->json($success), 200);
                    }
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage()); // If no records "No Content" status
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function DeleteClient() {
        // Cross validation if the request method is DELETE else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $reference = $_REQUEST['data']['reference'];

            try {
                $sql = $this->db->prepare("DELETE FROM client WHERE reference = :reference ");
                $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                $sql->execute();
                if ($sql) {
                    $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                    $this->response($this->json($success), 200);
                }
            } catch (Exception $ex) {
                $this->response('', $ex->getMessage()); // If no records "No Content" status
            }
        }
    }

}

?>