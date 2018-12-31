<?php

class Commande extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }

    public function CountCommande() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT (SELECT IFNULL(COUNT(ca.idCommAchat),0) FROM commandeachat ca WHERE ca.idSociete = cv.idSociete) + ifNull(COUNT(cv.idCommVente),0) AS countCommande FROM commandevente cv WHERE idSociete = :idSociete");
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

    public function GetAllCommandeAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT comma.*, s.idSociete FROM commandeachat comma left join societe s on comma.idSociete = s.idSociete WHERE s.idSociete = :idSociete");
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

    public function GetAllCommandeAchatEnCours() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT comma.*, s.idSociete FROM commandeachat comma left join societe s on comma.idSociete = s.idSociete WHERE s.idSociete = :idSociete AND comma.idEtat = 0");
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

    public function GetCommandeAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idCommande = $_REQUEST['data']["idCommande"];
            // Input validations
            if (!empty($idCommande)) {
                try {
                    //SELECT *,c.reference as referenceCom, a.reference as referenceArt FROM commandeachat c left join ligneachat l on c.idCommAchat = l.idCommande left join article a on a.idArticle = l.idArticle where c.idCommAchat = 44
                    $sql = $this->db->prepare("SELECT *,c.reference as referenceCom, a.reference as referenceArt FROM commandeachat c left join ligneachat l on c.idCommAchat = l.idCommande left join article a on a.idArticle = l.idArticle where c.idCommAchat = :idCommande");
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = $sql->fetchAll();

                        $listeElement = [];

                        foreach ($result as $article) {
                            $element['idArticle'] = $article['idArticle'];
                            $element['reference'] = $article['referenceArt'];
                            $element['description'] = $article['descriptionCom'];
                            $element['qte'] = $article['quantite'];
                            $element['idUnite'] = $article['idUnite'];
                            $element['idTva'] = $article['idTvaCom'];
                            $element['idNature'] = $article['idNature'];
                            $element['idFournisseur'] = $article['idFournisseur'];
                            $element['prixA'] = $article['prixUnitaire'];
                            $element['prixV'] = $article['prixV'];
                            $element['total'] = $article['sousTotal'];
                            $element['photo'] = $article['photo'];
                            $element['idCategorie'] = $article['idCategorie'];
                            $element['idSociete'] = $article['idSociete'];


                            array_push($listeElement, $element);
                        }

                        $result[0]['listeElments'] = $listeElement;
                        //$result[0]['reference'] = $listeElement;
                        // If success everythig is good send header as "OK" and user details
                        $this->response($this->json($result[0]), 200);
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

    public function InsertCommandeAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $idFournisseur = $_REQUEST['data']['idFournisseur'];
            $total = $_REQUEST['data']['totalallht'];
            $idEtat = $_REQUEST['data']['status'];
            $ListeElements = $_REQUEST['data']['ListeElements'];


            // Input validations
            if (!empty($reference)) {

                try {
                    $sql_commAchat = $this->db->prepare("INSERT INTO commandeachat (reference, total, date, idEtat, idFournisseur, idSociete )"
                            . "VALUES(:reference, :total, :date, :idEtat, :idFournisseur, :idSociete)");

                    $sql_commAchat->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql_commAchat->bindParam('total', $total, PDO::PARAM_STR);
                    $sql_commAchat->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql_commAchat->bindParam('idEtat', $idEtat, PDO::PARAM_INT);
                    $sql_commAchat->bindParam('idFournisseur', $idFournisseur, PDO::PARAM_INT);
                    $sql_commAchat->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                    $sql_commAchat->execute();

                    if ($sql_commAchat) {
                        $sql_get_commAchat = $this->db->prepare("SELECT idCommAchat FROM commandeachat WHERE reference = :reference AND idSociete = :idSociete");
                        $sql_get_commAchat->bindParam('reference', $reference, PDO::PARAM_STR);
                        $sql_get_commAchat->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                        $sql_get_commAchat->execute();

                        if ($sql_get_commAchat->rowCount() > 0) {
                            $result = $sql_get_commAchat->fetch();
                            $idCommande = $result['idCommAchat'];

                            foreach ($ListeElements as $element) {

                                $quantite = $element['qte'];
                                $prixUnitaire = $element['prixA'];
                                $description = $element['description'];
                                $sousTotal = $element['total'];
                                $idArticle = $element['idArticle'];
                                $idTva = $element['idTva'];

                                $sql_ligneAchat = $this->db->prepare("INSERT INTO ligneachat(quantite, prixUnitaire, descriptionCom, sousTotal, idCommande, idArticle, idTvaCom)"
                                        . "VALUES(:quantite, :prixUnitaire, :description, :sousTotal, :idCommande, :idArticle, :idTva)");

                                $sql_ligneAchat->bindParam('quantite', $quantite, PDO::PARAM_INT);
                                $sql_ligneAchat->bindParam('prixUnitaire', $prixUnitaire, PDO::PARAM_STR);
                                $sql_ligneAchat->bindParam('description', $description, PDO::PARAM_STR);
                                $sql_ligneAchat->bindParam('sousTotal', $sousTotal, PDO::PARAM_STR);
                                $sql_ligneAchat->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                                $sql_ligneAchat->bindParam('idArticle', $idArticle, PDO::PARAM_INT);
                                $sql_ligneAchat->bindParam('idTva', $idTva, PDO::PARAM_INT);

                                $sql_ligneAchat->execute();
                            }
                            if ($sql_ligneAchat) {
                                $success = array('status' => "Success", "msg" => "Successfully inserted");
                                $this->response($this->json($success), 200);
                            }
                        }
                    }
                    if ($sql_commAchat) {
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

    public function UpdateCommandeAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $idCommande = $_REQUEST['data']['idCommande'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $idFournisseur = $_REQUEST['data']['idFournisseur'];
            $total = $_REQUEST['data']['totalallht'];
            $idEtat = $_REQUEST['data']['status'];
            $ListeElements = $_REQUEST['data']['ListeElements'];


            // Input validations
            if (!empty($idCommande) && !empty($reference)) {

                try {
                    $sql_commAchat = $this->db->prepare("UPDATE commandeachat SET total = :total, date = :date, idEtat = :idEtat, idFournisseur =:idFournisseur, idSociete = :idSociete "
                            . "WHERE idCommAchat = :idCommande");

                    $sql_commAchat->bindParam('total', $total, PDO::PARAM_STR);
                    $sql_commAchat->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql_commAchat->bindParam('idEtat', $idEtat, PDO::PARAM_INT);
                    $sql_commAchat->bindParam('idFournisseur', $idFournisseur, PDO::PARAM_INT);
                    $sql_commAchat->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql_commAchat->bindParam('idCommande', $idCommande, PDO::PARAM_INT);

                    $sql_commAchat->execute();

                    $sql_remv_ligneAchat = $this->db->prepare("DELETE FROM ligneachat WHERE idCommande = :idCommande");
                    $sql_remv_ligneAchat->bindParam('idCommande', $idCommande, PDO::PARAM_INT);

                    $sql_remv_ligneAchat->execute();

                    if ($sql_commAchat && $sql_remv_ligneAchat) {
                        foreach ($ListeElements as $element) {
                            $quantite = $element['qte'];
                            $prixUnitaire = $element['prixA'];
                            $description = $element['description'];
                            $sousTotal = $element['total'];
                            $idArticle = $element['idArticle'];
                            $idTva = $element['idTva'];

                            $sql_ligneAchat = $this->db->prepare("INSERT INTO ligneachat(quantite, prixUnitaire, descriptionCom, sousTotal, idCommande, idArticle, idTvaCom)"
                                    . "VALUES(:quantite, :prixUnitaire, :description, :sousTotal, :idCommande, :idArticle, :idTva)");

                            $sql_ligneAchat->bindParam('quantite', $quantite, PDO::PARAM_INT);
                            $sql_ligneAchat->bindParam('prixUnitaire', $prixUnitaire, PDO::PARAM_STR);
                            $sql_ligneAchat->bindParam('description', $description, PDO::PARAM_STR);
                            $sql_ligneAchat->bindParam('sousTotal', $sousTotal, PDO::PARAM_STR);
                            $sql_ligneAchat->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                            $sql_ligneAchat->bindParam('idArticle', $idArticle, PDO::PARAM_INT);
                            $sql_ligneAchat->bindParam('idTva', $idTva, PDO::PARAM_INT);

                            $sql_ligneAchat->execute();
                        }
                        if ($sql_ligneAchat) {
                            $success = array('status' => "Success", "msg" => "Successfully updated");
                            $this->response($this->json($success), 200);
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

    public function DeleteCommandeAchat() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idCommande = $_REQUEST['data']["idCommande"];
            // Input validations
            if (!empty($idCommande)) {
                try {
                    $sql_remv_ligneAchat = $this->db->prepare("DELETE FROM ligneachat WHERE idCommande = :idCommande");
                    $sql_remv_ligneAchat->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql_remv_ligneAchat->execute();

                    if ($sql_remv_ligneAchat) {
                        $sql_remv_commAchat = $this->db->prepare("DELETE FROM commandeachat WHERE idCommAchat = :idCommande");
                        $sql_remv_commAchat->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                        $sql_remv_commAchat->execute();

                        if ($sql_remv_commAchat) {
                            $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                            $this->response($this->json($success), 200);
                        }
                    }
                } catch (Exception $ex) {
                    if ($ex->getCode() === '23000') {
                        $error = array('status' => "Failed", "msg" => "Impossible de supprimé cette commande");
                        $this->response($this->json($error), 400);
                    } else {
                        $error = array('status' => "Failed", "msg" => $ex->getMessage());
                        $this->response($this->json($error), 400);
                    }
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

    public function GetAllCommandeVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT commv.*, s.idSociete FROM commandevente commv left join societe s on commv.idSociete = s.idSociete WHERE s.idSociete = :idSociete");
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

    public function GetAllCommandeVenteEnCours() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT commv.*, s.idSociete FROM commandevente commv left join societe s on commv.idSociete = s.idSociete WHERE s.idSociete = :idSociete AND commv.idEtat != 4");
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

    public function GetCommandeVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idCommande = $_REQUEST['data']["idCommande"];
            // Input validations
            if (!empty($idCommande)) {
                try {
                    $sql = $this->db->prepare("SELECT *, c.reference as referenceCom, a.reference as referenceArt FROM commandevente c, lignevente l,article a where c.idCommVente = l.idCommande and a.idArticle = l.idArticle and c.idCommVente = :idCommande");
                    $sql->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = $sql->fetchAll();

                        $listeElement = [];

                        foreach ($result as $article) {
                            $element['idArticle'] = $article['idArticle'];
                            $element['reference'] = $article['referenceArt'];
                            $element['description'] = $article['descriptionCom'];
                            $element['qte'] = $article['quantite'];
                            $element['idUnite'] = $article['idUnite'];
                            $element['idTva'] = $article['idTvaCom'];
                            $element['idNature'] = $article['idNature'];
                            $element['idClient'] = $article['idClient'];
                            $element['prixA'] = $article['prixUnitaire'];
                            $element['prixV'] = $article['prixV'];
                            $element['total'] = $article['sousTotal'];
                            $element['photo'] = $article['photo'];
                            $element['idCategorie'] = $article['idCategorie'];
                            $element['idSociete'] = $article['idSociete'];


                            array_push($listeElement, $element);
                        }

                        $result[0]['listeElments'] = $listeElement;
                        //$result[0]['reference'] = $listeElement;
                        // If success everythig is good send header as "OK" and user details
                        $this->response($this->json($result[0]), 200);
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

    public function InsertCommandeVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $idClient = $_REQUEST['data']['idClient'];
            $total = $_REQUEST['data']['totalallht'];
            $idEtat = $_REQUEST['data']['status'];
            $ListeElements = $_REQUEST['data']['ListeElements'];


            // Input validations
            if (!empty($reference)) {

                try {
                    $sql_commVente = $this->db->prepare("INSERT INTO commandevente (reference, total, date, idEtat, idClient, idSociete )"
                            . "VALUES(:reference, :total, :date, :idEtat, :idClient, :idSociete)");

                    $sql_commVente->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql_commVente->bindParam('total', $total, PDO::PARAM_STR);
                    $sql_commVente->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql_commVente->bindParam('idEtat', $idEtat, PDO::PARAM_INT);
                    $sql_commVente->bindParam('idClient', $idClient, PDO::PARAM_INT);
                    $sql_commVente->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                    $sql_commVente->execute();

                    if ($sql_commVente) {
                        $sql_get_commVente = $this->db->prepare("SELECT idCommVente FROM commandevente WHERE reference = :reference AND idSociete = :idSociete");
                        $sql_get_commVente->bindParam('reference', $reference, PDO::PARAM_STR);
                        $sql_get_commVente->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                        $sql_get_commVente->execute();

                        if ($sql_get_commVente->rowCount() > 0) {
                            $result = $sql_get_commVente->fetch();
                            $idCommande = $result['idCommVente'];

                            foreach ($ListeElements as $element) {

                                $quantite = $element['qte'];
                                $prixUnitaire = $element['prixV'];
                                $description = $element['description'];
                                $sousTotal = $element['total'];
                                $idArticle = $element['idArticle'];
                                $idTva = $element['idTva'];

                                $sql_ligneVente = $this->db->prepare("INSERT INTO lignevente(quantite, prixUnitaire, descriptionCom, sousTotal, idCommande, idArticle, idTvaCom)"
                                        . "VALUES(:quantite, :prixUnitaire, :description, :sousTotal, :idCommande, :idArticle, :idTva)");

                                $sql_ligneVente->bindParam('quantite', $quantite, PDO::PARAM_INT);
                                $sql_ligneVente->bindParam('prixUnitaire', $prixUnitaire, PDO::PARAM_STR);
                                $sql_ligneVente->bindParam('description', $description, PDO::PARAM_STR);
                                $sql_ligneVente->bindParam('sousTotal', $sousTotal, PDO::PARAM_STR);
                                $sql_ligneVente->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                                $sql_ligneVente->bindParam('idArticle', $idArticle, PDO::PARAM_INT);
                                $sql_ligneVente->bindParam('idTva', $idTva, PDO::PARAM_INT);

                                $sql_ligneVente->execute();
                            }
                            if ($sql_ligneVente) {
                                $success = array('status' => "Success", "msg" => "Successfully inserted");
                                $this->response($this->json($success), 200);
                            }
                        }
                    }
                    if ($sql_commVente) {
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

    public function UpdateCommandeVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $idCommande = $_REQUEST['data']['idCommande'];
            $reference = $_REQUEST['data']['reference'];
            $dateCre = $_REQUEST['data']['dateCre'];
            $idClient = $_REQUEST['data']['idClient'];
            $total = $_REQUEST['data']['totalallht'];
            $idEtat = $_REQUEST['data']['status'];
            $ListeElements = $_REQUEST['data']['ListeElements'];


            // Input validations
            if (!empty($idCommande) && !empty($reference)) {

                try {
                    $sql_commVente = $this->db->prepare("UPDATE commandevente SET total = :total, date = :date, idEtat = :idEtat, idClient =:idClient, idSociete = :idSociete "
                            . "WHERE idCommVente = :idCommande");

                    $sql_commVente->bindParam('total', $total, PDO::PARAM_STR);
                    $sql_commVente->bindParam('date', $dateCre, PDO::PARAM_STR);
                    $sql_commVente->bindParam('idEtat', $idEtat, PDO::PARAM_INT);
                    $sql_commVente->bindParam('idClient', $idClient, PDO::PARAM_INT);
                    $sql_commVente->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql_commVente->bindParam('idCommande', $idCommande, PDO::PARAM_INT);

                    $sql_commVente->execute();

                    $sql_remv_ligneVente = $this->db->prepare("DELETE FROM lignevente WHERE idCommande = :idCommande");
                    $sql_remv_ligneVente->bindParam('idCommande', $idCommande, PDO::PARAM_INT);

                    $sql_remv_ligneVente->execute();

                    if ($sql_commVente && $sql_remv_ligneVente) {
                        foreach ($ListeElements as $element) {
                            $quantite = $element['qte'];
                            $prixUnitaire = $element['prixV'];
                            $description = $element['description'];
                            $sousTotal = $element['total'];
                            $idArticle = $element['idArticle'];
                            $idTva = $element['idTva'];

                            $sql_ligneVente = $this->db->prepare("INSERT INTO lignevente(quantite, prixUnitaire, descriptionCom, sousTotal, idCommande, idArticle, idTvaCom)"
                                    . "VALUES(:quantite, :prixUnitaire, :description, :sousTotal, :idCommande, :idArticle, :idTva)");

                            $sql_ligneVente->bindParam('quantite', $quantite, PDO::PARAM_INT);
                            $sql_ligneVente->bindParam('prixUnitaire', $prixUnitaire, PDO::PARAM_STR);
                            $sql_ligneVente->bindParam('description', $description, PDO::PARAM_STR);
                            $sql_ligneVente->bindParam('sousTotal', $sousTotal, PDO::PARAM_STR);
                            $sql_ligneVente->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                            $sql_ligneVente->bindParam('idArticle', $idArticle, PDO::PARAM_INT);
                            $sql_ligneVente->bindParam('idTva', $idTva, PDO::PARAM_INT);

                            $sql_ligneVente->execute();
                        }
                        if ($sql_ligneVente) {
                            $success = array('status' => "Success", "msg" => "Successfully updated");
                            $this->response($this->json($success), 200);
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

    public function DeleteCommandeVente() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idCommande = $_REQUEST['data']["idCommande"];
            // Input validations
            if (!empty($idCommande)) {
                try {
                    $sql_remv_ligneVente = $this->db->prepare("DELETE FROM lignevente WHERE idCommande = :idCommande");
                    $sql_remv_ligneVente->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                    $sql_remv_ligneVente->execute();

                    if ($sql_remv_ligneVente) {
                        $sql_remv_commVente = $this->db->prepare("DELETE FROM commandevente WHERE idCommVente = :idCommande");
                        $sql_remv_commVente->bindParam('idCommande', $idCommande, PDO::PARAM_INT);
                        $sql_remv_commVente->execute();

                        if ($sql_remv_commVente) {
                            $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                            $this->response($this->json($success), 200);
                        }
                    }
                } catch (Exception $ex) {
                    if ($ex->getCode() === '23000') {
                        $error = array('status' => "Failed", "msg" => "Impossible de supprimé cette commande");
                        $this->response($this->json($error), 400);
                    } else {
                        $error = array('status' => "Failed", "msg" => $ex->getMessage());
                        $this->response($this->json($error), 400);
                    }
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

}

?>