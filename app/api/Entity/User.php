<?php

class User extends API {

    public function __construct() {
        parent::__construct($this->db);    // Init parent contructor
    }

    public function GetUser() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $email = $_REQUEST['data']["email"];
            $password = $_REQUEST['data']["password"];
            $key = 'Basic ';


            // Input validations
            if (!empty($email) and !empty($password)) {
                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $password = sha1($password);
                    try {
                        $sql_user = $this->db->prepare("SELECT * FROM user WHERE login = :email AND password = :password LIMIT 1");

                        $sql_user->bindParam('email', $email, PDO::PARAM_STR);
                        $sql_user->bindParam('password', $password, PDO::PARAM_STR);

                        $sql_user->execute();

                        if ($sql_user->rowCount() > 0) {
                            $result = $sql_user->fetch();
                            $idSociete = $result['idSociete'];

                            $sql_soc = $this->db->prepare("SELECT idSociete, nomSoc, idabonnement FROM societe WHERE idSociete = :idSociete and not (idabonnement = 0 and (30  - ifnull(DATEDIFF(NOW(), dateCreation),0))<0) LIMIT 1");

                            $sql_soc->bindParam('idSociete', $idSociete, PDO::PARAM_STR);

                            $sql_soc->execute();

                            if ($sql_soc->rowCount() > 0) {
                                $dataSoc = $sql_soc->fetch();

                                $result += $dataSoc;

                                $authdata = $result['idSociete'] . ';' . $result['login'] . ';' . $result['password'] . ";" . $result['ip'];
                                $access_token = aes128Encrypt($key, $authdata);

                                $result['accesToken'] = $access_token;
                            }
                            else {
                                $error = array('status' => "Failed", "msg" => "Votre compte à été expiré");
                                $this->response($this->json($error), 400);
                            }
                            // If success everythig is good send header as "OK" and user details
                            $this->response($this->json($result), 200);
                        }
                        $error = array('status' => "Failed", "msg" => "L'adresse email ou le mot de passe sont incorrectes");
                        $this->response($this->json($error), 400);

                        $this->response('', 204); // If no records "No Content" status
                    } catch (Exception $ex) {
                        $this->response('', $ex->getMessage()); // If no records "No Content" status
                    }
                } else {
                    $error = array('status' => "Failed", "msg" => "Email invalid");
                    $this->response($this->json($error), 400);
                }
            } else {
                 $error = array('status' => "Failed", "msg" => "data invalid");
                $this->response($this->json($error), 400);
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid Email address or Password");
        $this->response($this->json($error), 400);
    }

    public function AddUser() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $login = $_REQUEST['data']['user']["login"];
            $password = $_REQUEST['data']['user']["password"];
            $nom = $_REQUEST['data']['user']["nom"];
            $prenom = $_REQUEST['data']['user']["prenom"];

            $ip = "";
            if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
                //check for ip from share internet
                $ip = $_SERVER["HTTP_CLIENT_IP"];
            } elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
                // Check for the Proxy User
                $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
            } else {
                $ip = $_SERVER["REMOTE_ADDR"];
            }

            $email = $_REQUEST['data']['societe']["email"];
            $tel = $_REQUEST['data']['societe']["tel"];
            $societe = $_REQUEST['data']['societe']["nom"];
            $typeAbonnement = $_REQUEST['data']['societe']["typeAbonnement"];

            // Input validations
            if (!empty($email) and !empty($password)) {
                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {

                    try {
                        $sql_checkSoc = $this->db->prepare("SELECT nomSoc, email FROM societe WHERE nomSoc = :societe OR email = :email ");
                        $sql_checkSoc->bindParam('societe', $societe, PDO::PARAM_STR);
                        $sql_checkSoc->bindParam('email', $email, PDO::PARAM_STR);
                        $sql_checkSoc->execute();

                        if ($sql_checkSoc->rowCount() <= 0) {

                            $sql_soc = $this->db->prepare("INSERT INTO societe (nomSoc, email, tel, idabonnement)"
                                    . "VALUES(:societe, :email, :tel, :typeAbonnement)");

                            $sql_soc->bindParam('societe', $societe, PDO::PARAM_STR);
                            $sql_soc->bindParam('email', $email, PDO::PARAM_STR);
                            $sql_soc->bindParam('tel', $tel, PDO::PARAM_STR);
                            $sql_soc->bindParam('typeAbonnement', $typeAbonnement, PDO::PARAM_INT);

                            $sql_soc->execute();

                            if ($sql_soc) {
                                $sql_get_soc = $this->db->prepare("SELECT idSociete,nomSoc FROM societe WHERE email = :email");
                                $sql_get_soc->bindParam('email', $email, PDO::PARAM_STR);

                                $sql_get_soc->execute();

                                if ($sql_get_soc->rowCount() > 0) {
                                    $result = $sql_get_soc->fetch();
                                    $idSociete = $result['idSociete'];
                                    $nomSociete = $result['nomSoc'];
                                    $password = sha1($password);
                                    $sql_user = $this->db->prepare("INSERT INTO user (login, password, nom, prenom, ip, idSociete, mission ,isAdmin)"
                                            . "VALUES(:login, :password, :nom, :prenom, :ip, :idSociete, 'Directeur général',1)");

                                    $sql_user->bindParam('login', $login, PDO::PARAM_STR);
                                    $sql_user->bindParam('password', $password, PDO::PARAM_STR);
                                    $sql_user->bindParam('nom', $nom, PDO::PARAM_STR);
                                    $sql_user->bindParam('prenom', $prenom, PDO::PARAM_STR);
                                    $sql_user->bindParam('ip', $ip, PDO::PARAM_STR);
                                    $sql_user->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                                    $sql_user->execute();

                                    if ($sql_user) {
                                        
                                        $sql_user_paramsGen = $this->db->prepare("INSERT INTO paramsGenerale (idDefaultTva, idDefaultDevise, idSociete)"
                                                . "VALUES(22, 5, :idSociete)");
                                        $sql_user_paramsGen->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                                        
                                        $sql_user_paramsGen->execute();
                                        
                                        $sql_user_paramsPdf = $this->db->prepare("INSERT INTO paramsPdf (textcolor, tablecolor, backcolor, idSociete)"
                                                . "VALUES('#717375', '#000000', '#FFFFFF', :idSociete)");
                                        $sql_user_paramsPdf->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                                        
                                        $sql_user_paramsPdf->execute();
                                        
                                        $success = array('status' => "Success", "msg" => "Successfully inserted");
                                        $this->response($this->json($success), 200);
                                    }
                                }
                            }
                        }
                        // If invalid inputs "Bad Request" status message and reason
                        $error = array('status' => "Failed", "msg" => "Nom de societé ou email déja exsite ");
                        $this->response($this->json($error), 400);
                    } catch (Exception $ex) {
                        $this->response('', $ex->getMessage()); // If no records "No Content" status
                    }
                } else {
                    $error = array('status' => "Failed", "msg" => "Email invalid");
                    $this->response($this->json($error), 400);
                }
            } else {
                 $error = array('status' => "Failed", "msg" => "data invalid");
                $this->response($this->json($error), 400);
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function InsertSubUser() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $nom = $_REQUEST['data']["nom"];
            $prenom = $_REQUEST['data']["prenom"];
            $login = $_REQUEST['data']["login"];
            $tel = $_REQUEST['data']["tel"];
            $password = $_REQUEST['data']["password"];

            $ip = "";
            // Input validations
            if (!empty($login) && !empty($password) && !empty($idSociete)) {
                if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
                    try {

                        $sql_get_user = $this->db->prepare("SELECT nom,login FROM user WHERE nom = :nom OR login = :login");
                        $sql_get_user->bindParam('nom', $nom, PDO::PARAM_STR);
                        $sql_get_user->bindParam('login', $login, PDO::PARAM_STR);

                        $sql_get_user->execute();

                        if ($sql_get_user->rowCount() <= 0) {

                            $password = sha1($password);
                            $sql_user = $this->db->prepare("INSERT INTO user (nom, prenom, login, password, tel, ip, idSociete)"
                                    . "VALUES(:nom, :prenom, :login, :password, :tel, :ip, :idSociete)");

                            $sql_user->bindParam('nom', $nom, PDO::PARAM_STR);
                            $sql_user->bindParam('prenom', $prenom, PDO::PARAM_STR);
                            $sql_user->bindParam('login', $login, PDO::PARAM_STR);
                            $sql_user->bindParam('password', $password, PDO::PARAM_STR);
                            $sql_user->bindParam('tel', $tel, PDO::PARAM_STR);
                            $sql_user->bindParam('ip', $ip, PDO::PARAM_STR);
                            $sql_user->bindParam('idSociete', $idSociete, PDO::PARAM_INT);

                            $sql_user->execute();

                            if ($sql_user) {
                                $sql = $this->db->prepare("SELECT * FROM user WHERE nom = :nom AND login = :login LIMIT 1");
                                $sql->bindParam('nom', $nom, PDO::PARAM_STR);
                                $sql->bindParam('login', $login, PDO::PARAM_STR);
                                $sql->execute();

                                if ($sql->rowCount() > 0) {
                                    $result = $sql->fetch();
                                    // If success everythig is good send header as "OK" and user details
                                    $this->response($this->json($result), 200);
                                }
                            }
                        }

                        // If invalid inputs "Bad Request" status message and reason
                        $error = array('status' => "Failed", "msg" => "Nom d'utilisateur existant ");
                        $this->response($this->json($error), 400);
                    } catch (Exception $ex) {
                        $this->response('', $ex->getMessage()); // If no records "No Content" status
                    }
                }
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function UpdateSubUser() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idUser = $_REQUEST['data']["idUser"];
            $nom = $_REQUEST['data']["nom"];
            $prenom = $_REQUEST['data']["prenom"];
            $tel = $_REQUEST['data']["tel"];
            $mission = $_REQUEST['data']["mission"];

            try {
                $sql_user = $this->db->prepare("UPDATE user SET nom = :nom, prenom = :prenom, tel = :tel, mission = :mission WHERE idUser = :idUser");

                $sql_user->bindParam('nom', $nom, PDO::PARAM_STR);
                $sql_user->bindParam('prenom', $prenom, PDO::PARAM_STR);
                $sql_user->bindParam('tel', $tel, PDO::PARAM_STR);
                $sql_user->bindParam('mission', $mission, PDO::PARAM_STR);
                $sql_user->bindParam('idUser', $idUser, PDO::PARAM_INT);

                $sql_user->execute();

                if ($sql_user) {
                    $sql = $this->db->prepare("SELECT * FROM user WHERE idUser = :idUser LIMIT 1");
                    $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql->rowCount() > 0) {
                        $result = $sql->fetch();
                        // If success everythig is good send header as "OK" and user details
                        $this->response($this->json($result), 200);
                    }
                }
            } catch (Exception $ex) {
                $this->response('', $ex->getMessage()); // If no records "No Content" status
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function UpdatedUserStatus() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idUser = $_REQUEST['data']["idUser"];
            $status = $_REQUEST['data']["status"];
            // Input validations
            if (!empty($idUser)) {
                try {
                    $sql = $this->db->prepare("UPDATE user set lastLogin = now(), active = :status WHERE idUser = :idUser");
                    $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);
                    $sql->bindParam('status', $status, PDO::PARAM_INT);
                    $sql->execute();

                    if ($sql) {
                        $success = array('status' => "Success", "msg" => "Successfully updated");
                        $this->response($this->json($success), 200);
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

    public function GetInfoUser() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            $idUser = $_REQUEST['data']["idUser"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM user WHERE idSociete = :idSociete AND idUser = :idUser LIMIT 1");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
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

    public function GetAllSubusers() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }
        if (isset($_REQUEST['data'])) {
            $idSociete = $_REQUEST['data']["idSociete"];
            // Input validations
            if (!empty($idSociete)) {
                try {
                    $sql = $this->db->prepare("SELECT * FROM user WHERE idSociete = :idSociete AND isAdmin = 0 order by idUser desc");
                    $sql->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                    $sql->execute();
                    if ($sql->rowCount() > 0) {
                        $result = array();
                        while ($rlt = $sql->fetchAll()) {
                            $result[] = $rlt;
                        }
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

    public function UpdateUser() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idUser = $_REQUEST['data']['idUser'];
            $nom = $_REQUEST['data']['nom'];
            $prenom = $_REQUEST['data']['prenom'];
            $photo = $_REQUEST['data']['photo'];
            $tel = $_REQUEST['data']['tel'];
            $mission = $_REQUEST['data']['mission'];

            // Input validations
            if (!empty($idUser)) {

                try {
                    $sql = $this->db->prepare("UPDATE user SET nom = :nom, prenom = :prenom, tel = :tel, photo = :photo, mission = :mission  "
                            . "WHERE idUser = :idUser");

                    $sql->bindParam('nom', $nom, PDO::PARAM_STR);
                    $sql->bindParam('prenom', $prenom, PDO::PARAM_STR);
                    $sql->bindParam('tel', $tel, PDO::PARAM_STR);
                    $sql->bindParam('photo', $photo, PDO::PARAM_STR);
                    $sql->bindParam('mission', $mission, PDO::PARAM_STR);
                    $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);

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

    public function UpdateUserMdp() {
        // Cross validation if the request method is POST else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idUser = $_REQUEST['data']['idUser'];
            $password = $_REQUEST['data']['password'];
            $nvPassword = $_REQUEST['data']['nvPassword'];
            $confPassword = $_REQUEST['data']['confPassword'];

            // Input validations
            if (!empty($idUser)) {
                if ($nvPassword === $confPassword) {
                    $password = sha1($password);
                    try {
                        $user_pass = $this->db->prepare("SELECT password FROM user WHERE password = :password AND idUser = :idUser LIMIT 1");
                        $user_pass->bindParam('password', $password, PDO::PARAM_STR);
                        $user_pass->bindParam('idUser', $idUser, PDO::PARAM_INT);
                        $user_pass->execute();

                        if ($user_pass->rowCount() > 0) {
                            $nvPassword = sha1($nvPassword);
                            $sql = $this->db->prepare("UPDATE user SET password = :newPassword WHERE idUser = :idUser");
                            $sql->bindParam('newPassword', $nvPassword, PDO::PARAM_STR);
                            $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);

                            $sql->execute();

                            if ($sql) {
                                $success = array('status' => "Success", "msg" => "Successfully updated");
                                $this->response($this->json($success), 200);
                            }
                        }
                        $error = array('status' => "Failed", "msg" => "Le mot de passe que vous avez saisi est incorrect.");
                        $this->response($this->json($error), 400);
                    } catch (Exception $ex) {
                        $this->response('', $ex->getMessage()); // If no records "No Content" status
                    }
                }

                $error = array('status' => "Failed", "msg" => "Les deux mot de passes ne sont pas identiques");
                $this->response($this->json($error), 400);
            }
        }

        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    public function DeleteUser() {
        // Cross validation if the request method is DELETE else it will return "Not Acceptable" status
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if (isset($_REQUEST['data'])) {
            $idUser = $_REQUEST['data']['idUser'];

            try {
                $sql = $this->db->prepare("DELETE FROM user WHERE idUser = :idUser ");
                $sql->bindParam('idUser', $idUser, PDO::PARAM_INT);
                $sql->execute();
                if ($sql) {
                    $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
                    $this->response($this->json($success), 200);
                }
            } catch (PDOException $ex) {
                if ($ex->getCode() === '23000') {
                    $error = array('status' => "Failed", "msg" => "Impossible de supprimé ce client");
                    $this->response($this->json($error), 400);
                } else {
                    $error = array('status' => "Failed", "msg" => $ex->getMessage());
                    $this->response($this->json($error), 400);
                }
            }
        }
    }

}

function aes128Encrypt($key, $data) {
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
    return base64_encode($encrypted . '::' . $iv);
}
