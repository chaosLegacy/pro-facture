<?php

class Utiles extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }

    public function GetAllTva() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $sql = $this->db->prepare("SELECT * FROM tva");
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
    }

    public function GetAllUnite() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $sql = $this->db->prepare("SELECT * FROM unite");
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
    }

    public function GetAllDevise() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $sql = $this->db->prepare("SELECT * FROM devise");
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
    }

    public function GetAllEtats() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $sql = $this->db->prepare("SELECT * FROM etats");
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
    }

    public function GetAllPaiementsMode() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $sql = $this->db->prepare("SELECT * FROM modePaiement");
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
    }

    public function GetParamsGen() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM paramsGenerale WHERE idSociete = :idSociete LIMIT 1");
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

    public function UpdateParamsGen() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $idDefaultTva = $_REQUEST['data']['idDefaultTva'];
            $idDefaultDevise = $_REQUEST['data']['idDefaultDevise'];
            // Input validations
            if (!empty($idSociete)) {

                try {
                    $sql = $this->db->prepare("UPDATE paramsGenerale SET idDefaultTva = :idDefaultTva, idDefaultDevise = :idDefaultDevise "
                            . "WHERE idSociete = :idSociete");

                    $sql->bindParam('idDefaultTva', $idDefaultTva, PDO::PARAM_STR);
                    $sql->bindParam('idDefaultDevise', $idDefaultDevise, PDO::PARAM_STR);
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

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

    public function GetDateExpirationSocicete() {
            // Cross validation if the request method is POST else it will return "Not Acceptable" status
            if ($this->get_request_method() != "POST") {
                $this->response('', 406);
            }

            if (isset($_REQUEST['data'])) {
                $idSociete = $_REQUEST['data']["idSociete"];
                // Input validations
                if (!empty($idSociete)) {
                    try {
                        $sql = $this->db->prepare("SELECT idSociete, nomSoc, idabonnement, 30  - ifnull(DATEDIFF(NOW(), dateCreation),0) as daysLeft FROM societe WHERE idSociete = :idSociete and not (idabonnement = 0 and (30  - ifnull(DATEDIFF(NOW(), dateCreation),0))<0) LIMIT 1");
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

    public function GetSociete() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM societe WHERE idSociete = :idSociete LIMIT 1");
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

    public function UpdateSociete() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $nomSoc = $_REQUEST['data']['nomSoc'];
            $tel = $_REQUEST['data']['tel'];
            $fax = $_REQUEST['data']['fax'];
            $patente = $_REQUEST['data']['patente'];
            $capitale = $_REQUEST['data']['capitale'];
            $adresse = $_REQUEST['data']['adresse'];
            $logo = $_REQUEST['data']['logo'];

            // Input validations
            if (!empty($idSociete) && !empty($nomSoc)) {

                try {
                    $sql = $this->db->prepare("UPDATE societe SET tel = :tel, fax = :fax, patente = :patente, capitale = :capitale, adresse = :adresse, logo = :logo "
                            . "WHERE idSociete = :idSociete");

                    $sql->bindParam('tel', $tel, PDO::PARAM_STR);
                    $sql->bindParam('fax', $fax, PDO::PARAM_STR);
                    $sql->bindParam('patente', $patente, PDO::PARAM_STR);
                    $sql->bindParam('capitale', $capitale, PDO::PARAM_STR);
                    $sql->bindParam('adresse', $adresse, PDO::PARAM_STR);
                    $sql->bindParam('logo', $logo, PDO::PARAM_STR);
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

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

    public function GetParamsPdf() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM paramsPdf WHERE idSociete = :idSociete LIMIT 1");
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

    public function UpdateParamsPdf() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $textcolor = $_REQUEST['data']['textcolor'];
            $tablecolor = $_REQUEST['data']['tablecolor'];
            $backcolor = $_REQUEST['data']['backcolor'];

            // Input validations
            if (!empty($idSociete)) {

                try {
                    $sql = $this->db->prepare("UPDATE paramsPdf SET textcolor = :textcolor, tablecolor = :tablecolor, backcolor = :backcolor "
                            . "WHERE idSociete = :idSociete");

                    $sql->bindParam('textcolor', $textcolor, PDO::PARAM_STR);
                    $sql->bindParam('tablecolor', $tablecolor, PDO::PARAM_STR);
                    $sql->bindParam('backcolor', $backcolor, PDO::PARAM_STR);
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

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

    
    public function GetPermission() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idUser = $_REQUEST['data']["idUser"];
            // Input validations
            if (!empty($idUser)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM permission WHERE idUser = :idUser LIMIT 1");
                    $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);
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
    
    public function InsertPermission() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {

            foreach ($_REQUEST['data'] as $data) {
                if (isset($data['idUser'])) {
                    $idUser = $data['idUser'];
                }
                if (isset($data['client'])) {
                    $client = (int) ($data['client'] === 'true');
                }
                if (isset($data['fournisseur'])) {
                    $fournisseur = (int) ($data['fournisseur'] === 'true');
                }
                if (isset($data['article'])) {
                    $article = (int) ($data['article'] === 'true');
                }
                if (isset($data['stock'])) {
                    $stock = (int) ($data['stock'] === 'true');
                }
                if (isset($data['factureAchat'])) {
                    $factureAchat = (int) ($data['factureAchat'] === 'true');
                }
                if (isset($data['factureVente'])) {
                    $factureVente = (int) ($data['factureVente'] === 'true');
                }
                if (isset($data['commandeAchat'])) {
                    $commandeAchat = (int) ($data['commandeAchat'] === 'true');
                }
                if (isset($data['commandeVente'])) {
                    $commandeVente = (int) ($data['commandeVente'] === 'true');
                }
                if (isset($data['bonLivraisonAchat'])) {
                    $bonLivraisonAchat = (int) ($data['bonLivraisonAchat'] === 'true');
                }
                if (isset($data['bonLivraisonVente'])) {
                    $bonLivraisonVente = (int) ($data['bonLivraisonVente'] === 'true');
                }
                if (isset($data['paiement'])) {
                    $paiement = (int) ($data['paiement'] === 'true');
                }
            }

            if (!empty($idUser)) {
                try {
                    $sql = $this->db->prepare("INSERT INTO permission (client, fournisseur, article, stock, factureAchat, factureVente, commandeAchat, commandeVente, bonLivraisonAchat, bonLivraisonVente, paiement, idUser)" .
                            " VALUES(:client, :fournisseur, :article, :stock, :factureAchat, :factureVente, :commandeAchat, :commandeVente, :bonLivraisonAchat, :bonLivraisonVente, :paiement, :idUser)");
                    $sql->bindParam('client', $client, PDO::PARAM_INT);
                    $sql->bindParam('fournisseur', $fournisseur, PDO::PARAM_INT);
                    $sql->bindParam('article', $article, PDO::PARAM_INT);
                    $sql->bindParam('stock', $stock, PDO::PARAM_INT);
                    $sql->bindParam('factureAchat', $factureAchat, PDO::PARAM_INT);
                    $sql->bindParam('factureVente', $factureVente, PDO::PARAM_INT);
                    $sql->bindParam('commandeAchat', $commandeAchat, PDO::PARAM_INT);
                    $sql->bindParam('commandeVente', $commandeVente, PDO::PARAM_INT);
                    $sql->bindParam('bonLivraisonAchat', $bonLivraisonAchat, PDO::PARAM_INT);
                    $sql->bindParam('bonLivraisonVente', $bonLivraisonVente, PDO::PARAM_INT);
                    $sql->bindParam('paiement', $paiement, PDO::PARAM_INT);
                    $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);

                    $sql->execute();

                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully inserted");
                        $this->response($this->json($success), 200);
                    }
                    // If invalid inputs "Bad Request" status message and reason
                    $error = array('status' => "Failed", "msg" => "Invalid params ");
                    $this->response($this->json($error), 400);
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage()); // If no records "No Content" status
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function UpdatePermission() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {

            foreach ($_REQUEST['data'] as $data) {
                if (isset($data['idUser'])) {
                    $idUser = $data['idUser'];
                }
                if (isset($data['client'])) {
                    $client = (int) ($data['client'] === 'true');
                }
                if (isset($data['fournisseur'])) {
                    $fournisseur = (int) ($data['fournisseur'] === 'true');
                }
                if (isset($data['article'])) {
                    $article = (int) ($data['article'] === 'true');
                }
                if (isset($data['stock'])) {
                    $stock = (int) ($data['stock'] === 'true');
                }
                if (isset($data['factureAchat'])) {
                    $factureAchat = (int) ($data['factureAchat'] === 'true');
                }
                if (isset($data['factureVente'])) {
                    $factureVente = (int) ($data['factureVente'] === 'true');
                }
                if (isset($data['commandeAchat'])) {
                    $commandeAchat = (int) ($data['commandeAchat'] === 'true');
                }
                if (isset($data['commandeVente'])) {
                    $commandeVente = (int) ($data['commandeVente'] === 'true');
                }
                if (isset($data['bonLivraisonAchat'])) {
                    $bonLivraisonAchat = (int) ($data['bonLivraisonAchat'] === 'true');
                }
                if (isset($data['bonLivraisonVente'])) {
                    $bonLivraisonVente = (int) ($data['bonLivraisonVente'] === 'true');
                }
                if (isset($data['paiement'])) {
                    $paiement = (int) ($data['paiement'] === 'true');
                }
            }

            if (!empty($idUser)) {
                try {
                    $sql = $this->db->prepare("UPDATE permission SET client = :client, fournisseur = :fournisseur, article = :article, stock = :stock, factureAchat = :factureAchat," .
                            "factureVente = :factureVente, commandeAchat = :commandeAchat, commandeVente = :commandeVente, bonLivraisonAchat = :bonLivraisonAchat," .
                            "bonLivraisonVente = :bonLivraisonVente, paiement = :paiement WHERE idUser= :idUser");

                    $sql->bindParam('client', $client, PDO::PARAM_INT);
                    $sql->bindParam('fournisseur', $fournisseur, PDO::PARAM_INT);
                    $sql->bindParam('article', $article, PDO::PARAM_INT);
                    $sql->bindParam('stock', $stock, PDO::PARAM_INT);
                    $sql->bindParam('factureAchat', $factureAchat, PDO::PARAM_INT);
                    $sql->bindParam('factureVente', $factureVente, PDO::PARAM_INT);
                    $sql->bindParam('commandeAchat', $commandeAchat, PDO::PARAM_INT);
                    $sql->bindParam('commandeVente', $commandeVente, PDO::PARAM_INT);
                    $sql->bindParam('bonLivraisonAchat', $bonLivraisonAchat, PDO::PARAM_INT);
                    $sql->bindParam('bonLivraisonVente', $bonLivraisonVente, PDO::PARAM_INT);
                    $sql->bindParam('paiement', $paiement, PDO::PARAM_INT);
                    $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);

                    $sql->execute();

                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully updated");
                        $this->response($this->json($success), 200);
                    }
                    // If invalid inputs "Bad Request" status message and reason
                    $error = array('status' => "Failed", "msg" => "Invalid params ");
                    $this->response($this->json($error), 400);
                } catch (Exception $ex) {
                    $this->response('', $ex->getMessage()); // If no records "No Content" status
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function DeletePermission() {
        // Cross validation if the request method is DELETE else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idUser = $_REQUEST['data']['idUser'];

            try {
                $sql = $this->db->prepare("DELETE FROM permission WHERE idUser = :idUser ");
                $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);
                $sql->execute();
                if ($sql) {
                    $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                    $this->response($this->json($success), 200);
                }
            } catch (PDOException $ex) {
                if ($ex->getCode() === '23000') {
                    $error = array('status' => "Failed", "msg" => "Impossible de supprimé cette permission");
                    $this->response($this->json($error), 400);
                } else {
                    $error = array('status' => "Failed", "msg" => $ex->getMessage());
                    $this->response($this->json($error), 400);
                }
            }
        }
    }

    // Stats
        
    public function StateClient() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT COUNT(idClient) as countClient FROM client WHERE idSociete = :idSociete");
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
    
    public function StateFournisseur() {
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
    
    public function GetAllFacturesVentesByYear() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $filterYear = $_REQUEST['data']["filterYear"];
            // Input validations
            if (!empty($idSociete) && !empty($filterYear)) {
                try {
                    $sql = $this->db->prepare("SELECT idFacture,date as dateCre,total,YEAR(date) AS factYear FROM facturevente WHERE idEtat != 5 and YEAR(date) = :filterYear AND idSociete = :idSociete");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('filterYear', $filterYear, PDO::PARAM_STR);
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
    
    public function GetAllFacturesAchatsByYear() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $filterYear = $_REQUEST['data']["filterYear"];
            // Input validations
            if (!empty($idSociete) && !empty($filterYear)) {
                try {
                    $sql = $this->db->prepare("SELECT idFacture,date as dateCre,total,YEAR(date) AS factYear FROM factureachat WHERE idEtat != 5 and YEAR(date) = :filterYear AND idSociete = :idSociete");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('filterYear', $filterYear, PDO::PARAM_STR);
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
    
    public function GetClientsNvFactures() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $filterYear = $_REQUEST['data']["filterYear"];
            // Input validations
            if (!empty($idSociete) && !empty($filterYear)) {
                try {
                    $sql = $this->db->prepare("select c.idClient ,(SELECT ifnull(MIN(f.date),0) FROM facturevente f INNER JOIN commandevente com on com.idCommVente = f.idCommande WHERE com.idClient = c.idClient AND YEAR(f.date) = :filterYear AND f.idSociete = :idSociete) as dateFirstFacture FROM client c group by c.idClient");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('filterYear', $filterYear, PDO::PARAM_STR);
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
    
    public function GetInfosFacturesAStats() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $filterYear = $_REQUEST['data']["filterYear"];
            // Input validations
            if (!empty($idSociete) && !empty($filterYear)) {
                try {
                    $sql = $this->db->prepare("SELECT idEtat,count(idFacture) as factACount, sum(total) as status_Total from factureachat where YEAR(date) = :filterYear AND idSociete = :idSociete group by idEtat");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('filterYear', $filterYear, PDO::PARAM_STR);
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
    
    public function GetInfosFacturesVStats() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $filterYear = $_REQUEST['data']["filterYear"];
            // Input validations
            if (!empty($idSociete) && !empty($filterYear)) {
                try {
                    $sql = $this->db->prepare("SELECT idEtat,count(idFacture) as factVCount, sum(total) as status_Total from facturevente where YEAR(date) = :filterYear AND idSociete = :idSociete group by idEtat");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('filterYear', $filterYear, PDO::PARAM_STR);
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
    
    public function GetRevenuPaiementOnFAByYear() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $filterYear = $_REQUEST['data']["filterYear"];
            // Input validations
            if (!empty($idSociete) && !empty($filterYear)) {
                try {
                    $sql = $this->db->prepare("
                    select fa.idfacture as idFactureAchat, 
                    ifnull(SUM(p.montant),0) as totalPAchat 
                    FROM factureachat fa INNER JOIN paiement p ON fa.idFacture = p.idFacture WHERE fa.idSociete = :idSociete 
                    AND YEAR(p.datePaiement) = :filterYear group by p.montant, p.datePaiement ");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('filterYear', $filterYear, PDO::PARAM_STR);
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
        
    }
    
    public function GetRevenuPaiementOnFVByYear() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $filterYear = $_REQUEST['data']["filterYear"];
            // Input validations
            if (!empty($idSociete) && !empty($filterYear)) {
                try {
                    $sql = $this->db->prepare("
                    select fv.idfacture as idFactureVente,
                    ifnull(SUM(p.montant),0) as totalPvente 
                    FROM facturevente fv INNER JOIN paiement p ON fv.idFacture = p.idFacture WHERE fv.idSociete = :idSociete
                    AND YEAR(p.datePaiement) = :filterYear group by p.montant, p.datePaiement ");
                    // $sql = $this->db->prepare("
                    //             SELECT 
                    //                 t1.idfacture as idFactureVente,
                    //                 ifnull(SUM(t2.montant),0) as idFactureVente
                    //             FROM
                    //                 facturevente t1
                    //             INNER JOIN paiement t2 
                    //                 ON t1.idFacture = t2.idFacture
                    //                 WHERE t1.idSociete = :idSociete 
                    //                 AND YEAR(t2.datePaiement) = :filterYear
                    //             GROUP BY idfacture
                    // ");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('filterYear', $filterYear, PDO::PARAM_STR);
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
        
    }
}

?>