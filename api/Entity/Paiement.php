<?php

class Paiement extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }

    public function GetAllPaiements() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT p.*, c.idClient, c.nom as nomClient, fv.idEtat as idEtatV, f.idFournisseur, f.nom as nomFournisseur,fa.idEtat as idEtatA FROM paiement p LEFT JOIN facturevente fv on fv.idFacture = p.idFacture LEFT JOIN commandevente commV on commV.idCommVente = fv.idCommande LEFT JOIN client c on c.idClient = commV.idClient LEFT JOIN factureachat fa on fa.idFacture = p.idFacture LEFT JOIN commandeachat commA on commA.idCommAchat = fa.idCommande LEFT JOIN fournisseur f on f.idFournisseur = commA.idFournisseur LEFT JOIN societe s on s.idSociete = p.idSociete WHERE p.idSociete = :idSociete order by p.datePaiement asc");
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

    public function InsertPaiement() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $reference = $_REQUEST['data']['reference'];
            $description = $_REQUEST['data']['description'];
            $datePaiement = $_REQUEST['data']['datePaiement'];
            $idFacture = $_REQUEST['data']['idFacture'];
            $montant = $_REQUEST['data']['montant'];
            $idMode = $_REQUEST['data']['idMode'];
            $idType = $_REQUEST['data']['idType'];

            // Input validations
            if (!empty($reference) && !empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("INSERT INTO paiement (reference, description, datePaiement, idFacture, montant,"
                            . "idMode, idType, idSociete)"
                            . "VALUES(:reference, :description, :datePaiement, :idFacture, :montant, :idMode, :idType, :idSociete)");

                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('datePaiement', $datePaiement, PDO::PARAM_STR);
                    $sql->bindParam('idFacture', $idFacture, PDO::PARAM_INT);
                    $sql->bindParam('montant', $montant, PDO::PARAM_STR);
                    $sql->bindParam('idMode', $idMode, PDO::PARAM_INT);
                    $sql->bindParam('idType', $idType, PDO::PARAM_INT);
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

    public function DeletePaiement() {
        // Cross validation if the request method is DELETE else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idPaiement = $_REQUEST['data']['idPaiement'];
            try {
                $sql = $this->db->prepare("DELETE FROM paiement WHERE idPaiement = :idPaiement");
                $sql->bindParam('idPaiement', $idPaiement, PDO::PARAM_INT);
                $sql->execute();
                if ($sql) {
                    $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
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
