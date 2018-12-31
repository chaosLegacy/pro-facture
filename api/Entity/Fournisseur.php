<?php

class Fournisseur extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }
    
    public function CountFournisseur() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT COUNT(idFournisseur) as countFournisseur FROM fournisseur WHERE idSociete = :idSociete");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = $sql->fetch();

                        // If success everythig is good send header as "OK" and user details
                        $this->response($this->json($result), 200);
                    }
                    $this->response('', 204); // If no records "No Content" status
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }
    
    public function GetAllFournisseurs() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT f.*, s.idSociete FROM fournisseur f left join societe s on f.idSociete = s.idSociete WHERE s.idSociete = :idSociete");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = array();
                        while ($rlt = $sql->fetchAll()) {
                            $result[] = $rlt;
                        }

                        // If success everythig is good send header as "OK" and return list of users in JSON format
                        $this->response($this->json($result), 200);
                    }
                    $this->response('', 204); // If no records "No Content" status
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }
    }

    public function GetFournisseur() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFournisseur = $_REQUEST['data']["idFournisseur"];
            // Input validations
            if (!empty($idFournisseur)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM fournisseur WHERE idFournisseur = :idFournisseur LIMIT 1");
                    $sql->bindParam('idFournisseur', $idFournisseur, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = $sql->fetch();

                        // If success everythig is good send header as "OK" and user details
                        $this->response($this->json($result), 200);
                    }
                    $this->response('', 204); // If no records "No Content" status
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }
    
    public function InsertFournisseur() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $reference = $_REQUEST['data']['reference'];
            $nom = $_REQUEST['data']['nom'];
            $tel = $_REQUEST['data']['tel'];
            $fax = $_REQUEST['data']['fax'];
            $email = $_REQUEST['data']['email'];
            $rue = $_REQUEST['data']['rue'];
            $ville = $_REQUEST['data']['ville'];
            $codeP = $_REQUEST['data']['codeP'];
            $pays = $_REQUEST['data']['pays'];

            // Input validations
            if (!empty($reference)) {

                try {
                    $sql = $this->db->prepare("INSERT INTO fournisseur (idSociete, reference, nom, tel, fax, email, rue,"
                            . " ville, pays, codeP)"
                            . "VALUES(:idSociete, :reference, :nom, :tel, :fax, :email, :rue, :ville, :pays, :codeP)");

                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql->bindParam('nom', $nom, PDO::PARAM_STR);
                    $sql->bindParam('tel', $tel, PDO::PARAM_STR);
                    $sql->bindParam('fax', $fax, PDO::PARAM_STR);
                    $sql->bindParam('email', $email, PDO::PARAM_STR);
                    $sql->bindParam('rue', $rue, PDO::PARAM_STR);
                    $sql->bindParam('ville', $ville, PDO::PARAM_STR);
                    $sql->bindParam('pays', $pays, PDO::PARAM_STR);
                    $sql->bindParam('codeP', $codeP, PDO::PARAM_STR);

                    $sql->execute();

                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully inserted");
                        $this->response($this->json($success), 200);
                    }
                } catch (PDOException $e) {
                    $this->response('', $e->getMessage()); // If no records "No Content" status
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function UpdateFournisseur() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFournisseur = $_REQUEST['data']['idFournisseur'];
            $reference = $_REQUEST['data']['reference'];
            $nom = $_REQUEST['data']['nom'];
            $tel = $_REQUEST['data']['tel'];
            $fax = $_REQUEST['data']['fax'];
            $email = $_REQUEST['data']['email'];
            $rue = $_REQUEST['data']['rue'];
            $ville = $_REQUEST['data']['ville'];
            $codeP = $_REQUEST['data']['codeP'];
            $pays = $_REQUEST['data']['pays'];

            // Input validations
            if (!empty($idFournisseur) && !empty($reference)) {

                try {
                    $sql = $this->db->prepare("UPDATE fournisseur SET nom = :nom, tel = :tel, fax = :fax, email = :email, rue = :rue,"
                            . " ville = :ville, pays = :pays, codeP = :codeP "
                            . "WHERE idFournisseur = :idFournisseur");

                    $sql->bindParam('nom', $nom, PDO::PARAM_STR);
                    $sql->bindParam('tel', $tel, PDO::PARAM_STR);
                    $sql->bindParam('fax', $fax, PDO::PARAM_STR);
                    $sql->bindParam('email', $email, PDO::PARAM_STR);
                    $sql->bindParam('rue', $rue, PDO::PARAM_STR);
                    $sql->bindParam('ville', $ville, PDO::PARAM_STR);
                    $sql->bindParam('pays', $pays, PDO::PARAM_STR);
                    $sql->bindParam('codeP', $codeP, PDO::PARAM_STR);
                    $sql->bindParam('idFournisseur', $idFournisseur, PDO::PARAM_INT);

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

    public function DeleteFournisseur() {
        // Cross validation if the request method is DELETE else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFournisseur = $_REQUEST['data']['idFournisseur'];

            try {
                $sql = $this->db->prepare("DELETE FROM fournisseur WHERE idFournisseur = :idFournisseur ");
                $sql->bindParam('idFournisseur', $idFournisseur, PDO::PARAM_STR);
                $sql->execute();
                if ($sql) {
                    $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                    $this->response($this->json($success), 200);
                }
            } catch (Exception $ex) {
                if ($ex->getCode() === '23000') {
                    $error = array('status' => "Failed", "msg" => "Impossible de supprimé ce fournisseur");
                    $this->response($this->json($error), 400);
                } else {
                  $error = array('status' => "Failed", "msg" => $ex->getMessage());
                  $this->response($this->json($error), 400);
                }
            }
        }
    }

}

?>