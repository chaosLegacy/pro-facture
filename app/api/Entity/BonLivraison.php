<?php

class BonLivraison extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }

    //=======================
    //---- Module d'achat
    //=======================

    public function GetAllBonLivraisonAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT bla.*, s.idSociete FROM bonlivraisonachat bla left join societe s on bla.idSociete = s.idSociete WHERE s.idSociete = :idSociete");
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

    public function GetBonLivraisonAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idBonLivraison = $_REQUEST['data']["idBonLivraison"];
            // Input validations
            if (!empty($idBonLivraison)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM bonlivraisonachat WHERE idBonLivraison = :idBonLivraison");
                    $sql->bindParam('idBonLivraison', $idBonLivraison, PDO::PARAM_INT);
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

    public function InsertBonLivraisonAchat() {
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

            // Input validations
            if (!empty($reference)) {

                try {
                    $sql = $this->db->prepare("INSERT INTO bonlivraisonachat (reference, date, description, attachement, idCommande, idSociete )"
                            . "VALUES(:reference, :date, :description, :attachement, :idCommande, :idSociete)");

                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('attachement', $attachment, PDO::PARAM_STR);
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                    $sql->execute();

                    if ($sql) {
                        $sql_get_commAchat = $this->db->prepare("SELECT * FROM ligneachat WHERE idCommande = :idCommande");
                        $sql_get_commAchat->bindParam('idCommande', $idCommande, PDO::PARAM_STR);
                        $sql_get_commAchat->execute();

                        if ($sql_get_commAchat->rowCount() > 0) {
                            $ListeElements = $sql_get_commAchat->fetchAll();

                            foreach ($ListeElements as $element) {

                                $quantite = $element['quantite'];
                                $description = $element['descriptionCom'];
                                $idArticle = $element['idArticle'];

                                $sql_ligneAchat = $this->db->prepare("INSERT INTO stock(idArticle, qte, description, idSociete)"
                                        . "VALUES(:idArticle, :quantite, :description, :idSociete)");

                                $sql_ligneAchat->bindParam('idArticle', $idArticle, PDO::PARAM_INT);
                                $sql_ligneAchat->bindParam('quantite', $quantite, PDO::PARAM_STR);
                                $sql_ligneAchat->bindParam('description', $description, PDO::PARAM_STR);
                                $sql_ligneAchat->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                                
                                $sql_ligneAchat->execute();
                            }
                            if ($sql_ligneAchat) {
                                $sql_comm_status = $this->db->prepare("UPDATE commandeachat SET idEtat = 3 WHERE idCommAchat = :idCommande");
                                $sql_comm_status->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                                $sql_comm_status->execute();

                                $success = array('status' => "Success", "msg" => "Successfully inserted");
                                $this->response($this->json($success), 200);
                            }
                        }
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

    public function UpdateBonLivraisonAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idBonLivraison = $_REQUEST['data']['idBonLivraison'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $description = $_REQUEST['data']['description'];
            $attachement = $_REQUEST['data']['attachement'];
            $idCommande = $_REQUEST['data']['idCommande'];

            // Input validations
            if (!empty($idBonLivraison)) {

                try {
                    $sql = $this->db->prepare("UPDATE bonlivraisonachat SET date = :date, description = :description, attachement = :attachement, idCommande = :idCommande "
                            . "WHERE idBonLivraison = :idBonLivraison");

                    $sql->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('attachement', $attachement, PDO::PARAM_STR);
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->bindParam('idBonLivraison', $idBonLivraison, PDO::PARAM_INT);

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

    public function GetAllBonLivraisonVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT blv.*, s.idSociete FROM bonlivraisonvente blv left join societe s on blv.idSociete = s.idSociete WHERE s.idSociete = :idSociete");
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

    public function GetBonLivraisonVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idBonLivraison = $_REQUEST['data']["idBonLivraison"];
            // Input validations
            if (!empty($idBonLivraison)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM bonlivraisonvente WHERE idBonLivraison = :idBonLivraison");
                    $sql->bindParam('idBonLivraison', $idBonLivraison, PDO::PARAM_INT);
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

    public function InsertBonLivraisonVente() {
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

            // Input validations
            if (!empty($reference)) {

                try {
                    $sql = $this->db->prepare("INSERT INTO bonlivraisonvente (reference, date, description, idCommande, idSociete )"
                            . "VALUES(:reference, :date, :description, :idCommande, :idSociete)");

                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                    $sql->execute();

                    if ($sql) {
                        $sql_get_commVente = $this->db->prepare("SELECT * FROM lignevente WHERE idCommande = :idCommande");
                        $sql_get_commVente->bindParam('idCommande', $idCommande, PDO::PARAM_STR);
                        $sql_get_commVente->execute();

                        if ($sql_get_commVente->rowCount() > 0) {
                            $ListeElements = $sql_get_commVente->fetchAll();

                            foreach ($ListeElements as $element) {

                                $quantite = ($element['quantite']) * (-1);

                                $description = $element['descriptionCom'];
                                $idArticle = $element['idArticle'];

                                $sql_ligneVente = $this->db->prepare("INSERT INTO stock(idArticle, qte, description, idSociete)"
                                        . "VALUES(:idArticle, :quantite, :description, :idSociete)");

                                $sql_ligneVente->bindParam('idArticle', $idArticle, PDO::PARAM_INT);
                                $sql_ligneVente->bindParam('quantite', $quantite, PDO::PARAM_STR);
                                $sql_ligneVente->bindParam('description', $description, PDO::PARAM_STR);
                                $sql_ligneVente->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                                $sql_ligneVente->execute();
                            }
                            if ($sql_ligneVente) {
                                $sql_comm_status = $this->db->prepare("UPDATE commandevente SET idEtat = 3 WHERE idCommVente = :idCommande");
                                $sql_comm_status->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                                $sql_comm_status->execute();

                                $success = array('status' => "Success", "msg" => "Successfully inserted");
                                $this->response($this->json($success), 200);
                            }
                        }
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