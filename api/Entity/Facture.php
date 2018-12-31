<?php

class Facture extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }
    
    public function CountFacture() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT (SELECT IFNULL(COUNT(fa.idFacture),0) FROM factureachat fa WHERE fa.idSociete = fv.idSociete) + ifNull(COUNT(fv.idFacture),0) AS countFacture FROM facturevente fv WHERE idSociete = :idSociete");
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
    
    //=======================
    //---- Module d'achat
    //=======================

    public function GetAllFactureAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {

                    $sql = $this->db->prepare("SELECT facta.*, s.idSociete FROM factureachat facta left join societe s on facta.idSociete = s.idSociete WHERE s.idSociete = :idSociete");
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

    public function GetFactureAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFacture = $_REQUEST['data']["idFacture"];
            // Input validations
            if (!empty($idFacture)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM factureachat WHERE idFacture = :idFacture");
                    $sql->bindParam('idFacture', $idFacture, PDO::PARAM_INT);
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

    public function InsertFactureAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $description = $_REQUEST['data']['description'];
            $attachment = $_REQUEST['data']['attachement'];
            $idCommande = $_REQUEST['data']['idCommande'];
            $idEtat = $_REQUEST['data']['status'];
            $total = $_REQUEST['data']['totalallht'];

            // Input validations
            if (!empty($reference)) {

                try {
                    $sql = $this->db->prepare("INSERT INTO factureachat (reference, total, date, description ,idEtat, attachement, idCommande, idSociete )"
                            . "VALUES(:reference, :total, :date, :description, :idEtat, :attachement, :idCommande, :idSociete)");

                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql->bindParam('total', $total, PDO::PARAM_STR);
                    $sql->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('idEtat', $idEtat, PDO::PARAM_INT);
                    $sql->bindParam('attachement', $attachment, PDO::PARAM_STR);
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                    $sql->execute();
                    if ($sql) {
                        $sql_comm_status = $this->db->prepare("UPDATE commandeachat SET idEtat = 4 WHERE idCommAchat = :idCommande");
                        $sql_comm_status->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                        $sql_comm_status->execute();

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

    public function UpdateFactureAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFacture = $_REQUEST['data']['idFacture'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $description = $_REQUEST['data']['description'];
            $attachement = $_REQUEST['data']['attachement'];
            $idCommande = $_REQUEST['data']['idCommande'];
            $total = $_REQUEST['data']['totalallht'];

            // Input validations
            if (!empty($idFacture)) {

                try {
                    $sql = $this->db->prepare("UPDATE factureachat SET total = :total, date = :date, description = :description, attachement = :attachement, idCommande = :idCommande "
                            . "WHERE idFacture = :idFacture");

                    $sql->bindParam('total', $total, PDO::PARAM_STR);
                    $sql->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('attachement', $attachement, PDO::PARAM_STR);
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->bindParam('idFacture', $idFacture, PDO::PARAM_INT);

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

    public function DeleteFactureAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFacture = $_REQUEST['data']["idFacture"];
            // Input validations
            if (!empty($idFacture)) {
                try {
                    $sql_remv_ligneAchat = $this->db->prepare("DELETE FROM ligneachat WHERE idFacture = :idFacture");
                    $sql_remv_ligneAchat->bindParam('idFacture', $idFacture, PDO::PARAM_INT);
                    $sql_remv_ligneAchat->execute();

                    if ($sql_remv_ligneAchat) {
                        $sql_remv_commAchat = $this->db->prepare("DELETE FROM commandeachat WHERE idCommAchat = :idFacture");
                        $sql_remv_commAchat->bindParam('idFacture', $idFacture, PDO::PARAM_INT);
                        $sql_remv_commAchat->execute();

                        if ($sql_remv_commAchat) {
                            $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                            $this->response($this->json($success), 200);
                        }
                    }
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function GetImpyedFactureAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("select fa.*,c.idFournisseur ,(fa.total - ifnull(SUM(p.montant),0)) as restApayer from factureachat fa LEFT JOIN paiement p on fa.idFacture = p.idFacture LEFT JOIN commandeachat c on fa.idCommande = c.idCommAchat LEFT JOIN societe s on fa.idSociete = s.idSociete where fa.idEtat != 2 AND s.idSociete = :idSociete group by p.idFacture , fa.idFacture");
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

    public function UpdateFactureAchatStatus() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFacture = $_REQUEST['data']['idFacture'];
            $idEtat = $_REQUEST['data']['idEtat'];

            // Input validations
            if (!empty($idFacture && !empty($idEtat))) {

                try {
                    $sql = $this->db->prepare("UPDATE factureachat SET idEtat = :idEtat WHERE idFacture = :idFacture");
                    $sql->bindParam('idEtat', $idEtat, PDO::PARAM_INT);
                    $sql->bindParam('idFacture', $idFacture, PDO::PARAM_INT);

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

    //=======================
    //---- Module de vente
    //=======================

    public function GetAllFactureVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT factv.*, s.idSociete FROM facturevente factv left join societe s on factv.idSociete = s.idSociete WHERE s.idSociete = :idSociete");
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

    public function GetFactureVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFacture = $_REQUEST['data']["idFacture"];
            // Input validations
            if (!empty($idFacture)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM facturevente WHERE idFacture = :idFacture");
                    $sql->bindParam('idFacture', $idFacture, PDO::PARAM_INT);
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

    public function InsertFactureVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $description = $_REQUEST['data']['description'];
            $idCommande = $_REQUEST['data']['idCommande'];
            $idEtat = $_REQUEST['data']['status'];
            $total = $_REQUEST['data']['totalallht'];

            // Input validations
            if (!empty($reference)) {

                try {
                    $sql = $this->db->prepare("INSERT INTO facturevente (reference, total, date, description, idEtat, idCommande, idSociete) "
                            . "VALUES(:reference, :total, :date, :description, :idEtat, :idCommande, :idSociete)");

                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql->bindParam('total', $total, PDO::PARAM_STR);
                    $sql->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('idEtat', $idEtat, PDO::PARAM_INT);
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                    $sql->execute();
                    if ($sql) {
                        $sql_comm_status = $this->db->prepare("UPDATE commandevente SET idEtat = 4 WHERE idCommVente = :idCommande");
                        $sql_comm_status->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                        $sql_comm_status->execute();

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

    public function UpdateFactureVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFacture = $_REQUEST['data']['idFacture'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $description = $_REQUEST['data']['description'];
            $idCommande = $_REQUEST['data']['idCommande'];
            $total = $_REQUEST['data']['totalallht'];

            // Input validations
            if (!empty($idFacture)) {

                try {
                    $sql = $this->db->prepare("UPDATE facturevente SET total = :total, date = :date, description = :description, idCommande = :idCommande "
                            . "WHERE idFacture = :idFacture");

                    $sql->bindParam('total', $total, PDO::PARAM_STR);
                    $sql->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->bindParam('idFacture', $idFacture, PDO::PARAM_INT);

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

    public function DeleteFactureVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idFacture = $_REQUEST['data']["idFacture"];
            // Input validations
            if (!empty($idFacture)) {
                try {
                    $sql_remv_ligneVente = $this->db->prepare("DELETE FROM lignevente WHERE idFacture = :idFacture");
                    $sql_remv_ligneVente->bindParam('idFacture', $idFacture, PDO::PARAM_INT);
                    $sql_remv_ligneVente->execute();

                    if ($sql_remv_ligneVente) {
                        $sql_remv_commVente = $this->db->prepare("DELETE FROM commandevente WHERE idCommVente = :idFacture");
                        $sql_remv_commVente->bindParam('idFacture', $idFacture, PDO::PARAM_INT);
                        $sql_remv_commVente->execute();

                        if ($sql_remv_commVente) {
                            $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                            $this->response($this->json($success), 200);
                        }
                    }
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage());
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function GetImpyedFactureVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("select fv.*,c.idClient ,(fv.total - ifnull(SUM(p.montant),0)) as restApayer from facturevente fv LEFT JOIN paiement p on fv.idFacture = p.idFacture LEFT JOIN commandevente c on fv.idCommande = c.idCommVente LEFT JOIN societe s on fv.idSociete = s.idSociete where fv.idEtat != 2 AND fv.idSociete = :idSociete group by p.idFacture , fv.idFacture");
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

    public function UpdateFactureVenteStatus() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            
            $idFacture = $_REQUEST['data']['idFacture'];
            $idEtat = $_REQUEST['data']['idEtat'];

            // Input validations
            if (!empty($idFacture)) {
                try {
                    $sql = $this->db->prepare("UPDATE facturevente SET idEtat = :idEtat WHERE idFacture = :idFacture");
                    $sql->bindParam('idEtat', $idEtat, PDO::PARAM_INT);
                    $sql->bindParam('idFacture', $idFacture, PDO::PARAM_INT);

                    $sql->execute();
                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully updated");
                        $this->response($this->json($success), 200);
                    }
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage()); // If no records "No Content" status
                }
            }
            // If invalid inputs "Bad Request" status message and reason
            $error = array('status' => "Failed", "msg" => "Invalid param");
            $this->response($this->json($error), 400);
        }
    }

}

?>