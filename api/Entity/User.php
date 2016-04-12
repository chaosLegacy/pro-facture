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
            if (!empty($email) and ! empty($password)) {
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
                            
                            $sql_soc = $this->db->prepare("SELECT idSociete, nomSoc FROM societe WHERE idSociete = :idSociete LIMIT 1");
                            
                            $sql_soc->bindParam('idSociete', $idSociete, PDO::PARAM_STR);

                            $sql_soc->execute();
                            
                            if ($sql_soc->rowCount() > 0) {
                                $dataSoc = $sql_soc->fetch();
                                
                                $result += $dataSoc;
                                
                                $authdata = $result['idSociete'].';'.$result['login'].';'. $result['password'].";".$result['ip']; 
                                $access_token = aes128Encrypt($key, $authdata);
                                
                                $result['accesToken']= $access_token;
                            }
                            
                            
                            
                            // If success everythig is good send header as "OK" and user details
                            $this->response($this->json($result), 200);
                        }
                    } catch (Exception $ex) {
                        $this->response('', $ex->getMessage()); // If no records "No Content" status
                    }
                }
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
            
            $ip = "";
            if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
             //check for ip from share internet
             $ip = $_SERVER["HTTP_CLIENT_IP"];
            }
            elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
             // Check for the Proxy User
             $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
            }
            else {
             $ip = $_SERVER["REMOTE_ADDR"];
            }

            $email = $_REQUEST['data']['societe']["email"];
            $tel = $_REQUEST['data']['societe']["tel"];
            $nom = $_REQUEST['data']['societe']["nom"];
            $dateCreation = $_REQUEST['data']['societe']["dateCreation"];
            $typeAbonnement = $_REQUEST['data']['societe']["typeAbonnement"];

            // Input validations
            if (!empty($email) and ! empty($password)) {
                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {

                    try {
                        $sql_soc = $this->db->prepare("INSERT INTO societe (nom, email, tel, dateCreation)"
                                . "VALUES(:nom, :email, :tel, :dateCreation)");

                        $sql_soc->bindParam('nom', $nom, PDO::PARAM_STR);
                        $sql_soc->bindParam('email', $email, PDO::PARAM_STR);
                        $sql_soc->bindParam('tel', $tel, PDO::PARAM_STR);
                        $sql_soc->bindParam('dateCreation', $dateCreation, PDO::PARAM_STR);

                        $sql_soc->execute();

                        if ($sql_soc) {
                            $sql_get_soc = $this->db->prepare("SELECT idSociete FROM societe WHERE email = :email AND dateCreation = :dateCreation");
                            $sql_get_soc->bindParam('email', $email, PDO::PARAM_STR);
                            $sql_get_soc->bindParam('dateCreation', $dateCreation, PDO::PARAM_STR);

                            $sql_get_soc->execute();

                            if ($sql_get_soc->rowCount() > 0) {
                                $result = $sql_get_soc->fetch();
                                $idSociete = $result['idSociete'];
                                $password = sha1($password);
                                $sql_user = $this->db->prepare("INSERT INTO user (login, password, ip, idSociete, isAdmin)"
                                        . "VALUES(:login, :password, :ip, :idSociete, 1)");

                                $sql_user->bindParam('login', $login, PDO::PARAM_STR);
                                $sql_user->bindParam('password', $password, PDO::PARAM_STR);
                                $sql_user->bindParam('ip', $ip, PDO::PARAM_STR);
                                $sql_user->bindParam('idSociete', $idSociete, PDO::PARAM_INT);
                                
                                $sql_user->execute();
                                
                                if ($sql_user) {
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
        }
        
        // If invalid inputs "Bad Request" status message and reason
        $error = array('status' => "Failed", "msg" => "Invalid param");
        $this->response($this->json($error), 400);
    }

    private function users() {
        // Cross validation if the request method is GET else it will return "Not Acceptable" status
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $sql = $this->db->query("SELECT user_id, user_fullname, user_email FROM users WHERE user_status = 1");
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

    private function deleteUser() {
        // Cross validation if the request method is DELETE else it will return "Not Acceptable" status
        if ($this->get_request_method() != "DELETE") {
            $this->response('', 406);
        }
        $id = (int) $this->_request['id'];
        if ($id > 0) {
            mysql_query("DELETE FROM users WHERE user_id = $id");
            $success = array('status' => "Success", "msg" => "Successfully one record deleted.");
            $this->response($this->json($success), 200);
        } else
            $this->response('', 204); // If no records "No Content" status
    }

}

function aes128Encrypt($key, $data) {
  if(16 !== strlen($key)) $key = hash('MD5', $key, true);
  $padding = 16 - (strlen($data) % 16);
  $data .= str_repeat(chr($padding), $padding);
  return base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $data, MCRYPT_MODE_CBC, str_repeat("\0", 16)));
}

?>