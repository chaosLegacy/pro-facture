<?php

class Historique extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }


    public function GetAllHistorique() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT h.*,u.nom, u.prenom, u.login, u.photo FROM historique h INNER JOIN user u ON h.idUser = u.idUser AND h.idSociete = :idSociete order by h.dateAction DESC");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = array();
                        while ($rlt = $sql->fetchAll()) {
                            $result[] = $rlt;
                        }

                        // If success everythig is good send header as "OK" and return list of users in JSON format
                        $this->response($this->json($result[0]), 200);
                    }
                    $this->response('', 204); // If no records "No Content" status
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }
    }

    public function GetAllNoneSeenHistorique() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT h.*,u.nom, u.prenom, u.login, u.photo FROM historique h INNER JOIN user u ON h.idUser = u.idUser AND h.idSociete = :idSociete AND h.vue = 0 order by h.dateAction DESC");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = array();
                        while ($rlt = $sql->fetchAll()) {
                            $result[] = $rlt;
                        }

                        // If success everythig is good send header as "OK" and return list of users in JSON format
                        $this->response($this->json($result[0]), 200);
                    }
                    $this->response('', 204); // If no records "No Content" status
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }
    }
    
    public function UpdateViewedHistorique() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idhistorique = $_REQUEST['data']["idhistorique"];
            // Input validations
            if (!empty($idhistorique)) {
                try {
                    $sql = $this->db->prepare("UPDATE historique SET vue = 1 WHERE idhistorique = :idhistorique");
                    $sql->bindParam('idhistorique', $idhistorique, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully updated");
                        $this->response($this->json($success), 200);
                    }
                    
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }
    }
    
    public function UpdateAllHistoriqueToViewed() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("UPDATE historique SET vue = 1 WHERE idSociete = :idSociete");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully updated");
                        $this->response($this->json($success), 200);
                    }
                    
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }
    }
    
    public function Insertistorique() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $idUser = $_REQUEST['data']['idUser'];
            $idObjet = $_REQUEST['data']['idObjet'];
            $typeHisto = $_REQUEST['data']['typeHisto'];
            $typeAction = $_REQUEST['data']['typeAction'];
            $data = $_REQUEST['data']['data'];
            $dateAction = $_REQUEST['data']['dateAction'];


            // Input validations
            if (!empty($idSociete)) {

                try {
                    $sql = $this->db->prepare("INSERT INTO historique (idUser, idObjet, typeHisto, typeAction, data, dateAction, idSociete )"
                            . "VALUES(:idUser, :idObjet, :typeHisto, :typeAction, :data, :dateAction, :idSociete)");

                    $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);
                    $sql->bindParam('idObjet', $idObjet, PDO::PARAM_STR);
                    $sql->bindParam('typeHisto', $typeHisto, PDO::PARAM_STR);
                    $sql->bindParam('typeAction', $typeAction, PDO::PARAM_INT);
                    $sql->bindParam('data', $data, PDO::PARAM_STR);
                    $sql->bindParam('dateAction', $dateAction, PDO::PARAM_STR);
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

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

}

?>