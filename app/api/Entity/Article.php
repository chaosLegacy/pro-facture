<?php

class Article extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }

    public function GetAllArticles() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT a.*,IFNULL(SUM(stk.qte),0) AS qte, s.idSociete FROM article a left join societe s on a.idSociete = s.idSociete left join stock stk on a.idArticle = stk.idArticle WHERE s.idSociete = :idSociete group by a.idArticle");
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

    public function GetArticle() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idArticle = $_REQUEST['data']["idArticle"];
            // Input validations
            if (!empty($idArticle)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM article WHERE idArticle = :idArticle LIMIT 1");
                    $sql->bindParam('idArticle', $idArticle, PDO::PARAM_INT);
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

    public function GetStock() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT s.*,a.reference,a.idUnite,a.idArticle FROM stock s LEFT JOIN article a  on s.idArticle = a.idArticle WHERE s.idSociete = :idSociete");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = array();
                        while ($rlt = $sql->fetchAll()) {
                            $result[] = $rlt;
                        }

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

    public function InsertStock() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $idArticle = $_REQUEST['data']['idArticle'];
            $qte = $_REQUEST['data']['qte'];
            $description = $_REQUEST['data']['description'];
            $date = $_REQUEST['data']['date'];

            // Input validations
            if (!empty($idArticle) && !empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("INSERT INTO stock (idArticle, qte, description, date, idSociete) "
                            . "VALUES(:idArticle, :qte, :description, :date, :idSociete)");
                    $sql->bindParam('idArticle', $idArticle, PDO::PARAM_INT);
                    $sql->bindParam('qte', $qte, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('date', $date, PDO::PARAM_STR);
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

    public function DeleteStock() {
        // Cross validation if the request method is DELETE else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idStock = $_REQUEST['data']['idStock'];

            try {
                $sql = $this->db->prepare("DELETE FROM stock WHERE idStock = :idStock ");
                $sql->bindParam('idStock', $idStock, PDO::PARAM_STR);
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

    public function InsertArticle() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']['idSociete'];
            $reference = $_REQUEST['data']['reference'];
            $designation = $_REQUEST['data']['designation'];
            $description = $_REQUEST['data']['description'];
            $idUnite = $_REQUEST['data']['idUnite'];
            $idTva = $_REQUEST['data']['idTva'];
            $idNature = $_REQUEST['data']['idNature'];
            $prixA = $_REQUEST['data']['prixA'];
            $prixV = $_REQUEST['data']['prixV'];
            $photo = $_REQUEST['data']['photo'];
            $idCategorie = $_REQUEST['data']['idCategorie'];

            // Input validations
            if (!empty($reference)) {
                try {
                    $sql = $this->db->prepare("INSERT INTO article (idSociete, reference, designation, description, idUnite, idTva, idNature,"
                            . "prixA, prixV, photo, idCategorie)"
                            . "VALUES(:idSociete, :reference, :designation, :description, :idUnite, :idTva, :idNature, :prixA, :prixV,"
                            . ":photo, 2)");

                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->bindParam('reference', $reference, PDO::PARAM_STR);
                    $sql->bindParam('designation', $designation, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('idUnite', $idUnite, PDO::PARAM_INT);
                    $sql->bindParam('idTva', $idTva, PDO::PARAM_INT);
                    $sql->bindParam('idNature', $idNature, PDO::PARAM_INT);
                    $sql->bindParam('prixA', $prixA, PDO::PARAM_STR);
                    $sql->bindParam('prixV', $prixV, PDO::PARAM_STR);
                    $sql->bindParam('photo', $photo, PDO::PARAM_STR);

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

    public function UpdateArticle() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idArticle = $_REQUEST['data']['idArticle'];
            $reference = $_REQUEST['data']['reference'];
            $designation = $_REQUEST['data']['designation'];
            $description = $_REQUEST['data']['description'];
            $idUnite = $_REQUEST['data']['idUnite'];
            $idTva = $_REQUEST['data']['idTva'];
            $idNature = $_REQUEST['data']['idNature'];
            $prixA = $_REQUEST['data']['prixA'];
            $prixV = $_REQUEST['data']['prixV'];
            $photo = $_REQUEST['data']['photo'];
            $idCategorie = $_REQUEST['data']['idCategorie'];

            // Input validations
            if (!empty($reference)) {

                try {
                    $sql = $this->db->prepare("UPDATE article SET designation = :designation, description = :description, idUnite = :idUnite,"
                            . " idTva = :idTva, idNature = :idNature, prixA = :prixA, prixV = :prixV, photo = :photo, idCategorie = 2 "
                            . "WHERE idArticle = :idArticle");

                    $sql->bindParam('designation', $designation, PDO::PARAM_STR);
                    $sql->bindParam('description', $description, PDO::PARAM_STR);
                    $sql->bindParam('idUnite', $idUnite, PDO::PARAM_INT);
                    $sql->bindParam('idTva', $idTva, PDO::PARAM_INT);
                    $sql->bindParam('idNature', $idNature, PDO::PARAM_INT);
                    $sql->bindParam('prixA', $prixA, PDO::PARAM_STR);
                    $sql->bindParam('prixV', $prixV, PDO::PARAM_STR);
                    $sql->bindParam('photo', $photo, PDO::PARAM_STR);
                    $sql->bindParam('idArticle', $idArticle, PDO::PARAM_INT);


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

    public function DeleteArticle() {
        // Cross validation if the request method is DELETE else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idArticle = $_REQUEST['data']['idArticle'];

            try {
                $sql = $this->db->prepare("DELETE FROM article WHERE idArticle = :idArticle ");
                $sql->bindParam('idArticle', $idArticle, PDO::PARAM_STR);
                $sql->execute();
                if ($sql) {
                    $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                    $this->response($this->json($success), 200);
                }
            } catch (PDOException $ex) {
                if ($ex->getCode() === '23000') {
                    $error = array('status' => "Failed", "msg" => "Impossible de supprimé cette article");
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