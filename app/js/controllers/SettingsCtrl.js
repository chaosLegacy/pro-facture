app.controller('SettingsCtrl', ['$scope', 'ServiceUtiles', 'ServiceUsers', '$localStorage', '$state', '$timeout', 'toaster', 'FileUploader', '$modal', function ($scope, ServiceUtiles, ServiceUsers, $localStorage, $state, $timeout, toaster, FileUploader, $modal) {
        var idSociete = $scope.app.user.idSociete;
        var idUser = $scope.app.user.idUser;
        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        }
        
        //get params General devise
        ServiceUtiles.getParamsGenrals(idSociete).then(function (general) {
            $scope.genrale = general;
            ServiceUtiles.getListDevise().then(function (devise) {
                $scope.ListeDevise = devise;
                angular.forEach($scope.ListeDevise, function (value) {
                    if ($scope.genrale.idDefaultDevise === value.idDevise) {
                        $scope.currency = value.label;
                    }
                });
            });
        });

        ServiceUtiles.getListTva().then(function (data) {
            $scope.ListeTva = data;
        });


        ServiceUtiles.getSociete(idSociete).then(function (data) {
            $scope.societe = data;
        });

        ServiceUtiles.getParamsPdf(idSociete).then(function (data) {
            $scope.paramPdf = data;
        });

        ServiceUsers.getInfoUser(idSociete, idUser).then(function (data) {
            $scope.user = data;
            $scope.user.password = "";
        });

        function getSubUsers() {
            ServiceUsers.getSubusers(idSociete).then(function (data) {
                $scope.ListeSubusers = data;
            });
        }
        getSubUsers();

        var uploader = $scope.uploader = new FileUploader({
            url: 'companies/upload.php',
            formData: [{
                    id: (Date.now() + "").substring(4, 15),
                    societe: $scope.app.user.societeName,
                    section: 'logo'
                }]
        });
        uploader.onAfterAddingFile = function (item) {
            $scope.societe.logo = "companies/" + $scope.app.user.societeName + "/logo/" + item.formData[0].id + item.file.name;
            $scope.user.photo = "companies/" + $scope.app.user.societeName + "/logo/" + item.formData[0].id + item.file.name;
        };

        $scope.societe = {
            idSociete: '',
            nomSoc: '',
            tel: '',
            fax: '',
            patente: '',
            capitale: '',
            adresse: '',
            logo: ''
        };

        $scope.paramPdf = {
            idSociete: '',
            textcolor: '',
            tablecolor: '',
            backcolor: ''
        };

        $scope.user = {
            idUser: '',
            nom: '',
            prenom: '',
            photo: '',
            mission:'',
            tel: '',
            password: '',
            nvPassword: '',
            confPassword: ''
        };
        $scope.userEtat = function (status) {
            var statusLabel = "";
            switch (status) {
                case 0:
                    statusLabel = 'Déconnecté';
                    break;
                case 1:
                    statusLabel = 'Disponible';
                    break;
                case 2:
                    statusLabel = 'Hors de vue';
                    break;
            }
            return statusLabel;
        };

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        $scope.listePermission = [
            {id: 'client', label: 'Création ,supression et modifications des clients', value: false},
            {id: 'fournisseur', label: 'Création ,supression et modifications des fournisseurs', value: false},
            {id: 'article', label: 'Création ,supression et modifications des articles', value: false},
            {id: 'stock', label: 'Ajout et supression de stock', value: false},
            {id: 'factureAchat', label: 'Création et supression des factures d\'achats', value: false},
            {id: 'factureVente', label: 'Création et supression des factures de ventes', value: false},
            {id: 'commandeAchat', label: 'Création, supression et modifications des commande d\'achats', value: false},
            {id: 'commandeVente', label: 'Création, supression et modifications des commande de ventes', value: false},
            {id: 'bonLivraisonAchat', label: 'Création, et supression des bons de livraisons d\'achats', value: false},
            {id: 'bonLivraisonVente', label: 'Création et supression des bons de livraisons de ventes', value: false},
            {id: 'paiement', label: 'Création et supression des paiements', value: false}
        ];

        function emptyUserData() {
            var emailTrim = $scope.societe.email.split('@');
            $scope.subuser = {
                idUser: '',
                nom: '',
                prenom: '',
                login: '',
                societeEmail: emailTrim[1],
                photo: 'img/defaultUser.png',
                tel: '',
                active: '',
                password: '',
                confPassword: '',
                mission:'',
                oper: 1,
                listePermission: $scope.listePermission
            };
        }

        function checkDataSubUser(subUser) {
            var vrfNom = new RegExp("^[a-zA-Z0-9 ]+$", "g");
            var vrfPrenom = new RegExp("^[a-zA-Z0-9 ]+$", "g");
            if (subUser.nom === "" || subUser.prenom === "") {
                return 'Le nom ou le prenom de l\'utilisateur est obligatoire';
            } else {
                if (!vrfNom.test(subUser.nom)) {
                    return "Le nom doit contenir seulement des caractères alpha-numérique ";
                }
                if (!vrfPrenom.test(subUser.prenom)) {
                    return "Le prenom doit contenir seulement des caractères alpha-numérique ";
                }
            }

            if (subUser.oper === 1) {
                var userEmail = subUser.login + '@' + subUser.societeEmail;
                if (!validateEmail(userEmail)) {
                    return "Adresse email invalide";
                }
                if (subUser.password === "" || subUser.confPassword === "") {
                    return "Veuillez saisir un mot de passe pour cette utilisateur";
                }
                if (subUser.password.length < 6 || subUser.confPassword.length < 6) {
                    return "Pour plus de sécurtité vous devez spécifier plus des charactères";
                }
                if (subUser.password !== subUser.confPassword) {
                    return "Les deux mots de passes ne sont pas identiques.";
                }
            }

            ;
            return "";
        }

        $scope.updateSociete = function (societe) {
            ServiceUtiles.updateSociete(societe).then(function () {
                notifyBox('Succès', 'Edition de la Societe: ' + societe.nomSoc + ' effectué avec succès', 'success');
            });
        };

        $scope.updateUser = function (user) {debugger;
            var msg = "";
            $scope.authError = null;
            var vrfNom = new RegExp("^[a-zA-Z0-9 ]+$", "g");
            var vrfPrenom = new RegExp("^[a-zA-Z0-9 ]+$", "g");
            if (user.nom === "" || user.prenom === "") {
                msg = "Veuillez saisir votre nom et votre prénom";
            } else {
                if (!vrfNom.test(user.nom)) {
                    msg = "Le nom doit contenir seulement des caractères alpha-numérique ";
                }
                if (!vrfPrenom.test(user.prenom)) {
                    msg = "Le prenom doit contenir seulement des caractères alpha-numérique ";
                }
            }
            if(user.photo === "") {
                user.photo = $scope.app.user.photo;
            }
            if (msg !== "") {
                $scope.authError = msg;
            } else {
                $scope.authError = null;
                ServiceUsers.updateUser(user).then(function () {
                    $scope.app.user.userName = user.nom + " " + user.prenom;
                    notifyBox('Succès', 'Edition de l\'utilisateur: ' + user.nom + ' ' + user.prenom + ' effectué avec succès', 'success');
                });
            }
        };

        $scope.updateUserMdp = function (user) {
            var msg = "";
            $scope.authError = null;
            $scope.authSuccess = null;
            if (user.password === "" || user.nvPassword === "" || user.confPassword === "") {
                msg = "Veuillez remplir tous les champs";
            }
            if (user.nvPassword.length < 6 || user.confPassword.length < 6) {
                msg = "Pour plus de sécurtité vous devez spécifier plus des charactères";
            }
            if (user.nvPassword !== user.confPassword) {
                msg = "Les deux mots de passes ne sont pas identiques.";
            }
            if (msg !== "") {
                $scope.authError = msg;
            } else {
                ServiceUsers.updateUserMdp(user).then(function (response) {
                    if (response.status !== "Success") {
                        $scope.authError = response.data.msg;
                    } else {
                        $scope.authError = null;
                        $scope.authSuccess = "Votre mot de passe a été changé avec success vos devez vous reconnecter pour appliquer les nouveaux changements";
                        notifyBox('Succès', 'Edition de l\'utilisateur: ' + user.nom + ' ' + user.prenom + ' effectué avec succès', 'success');
                        $timeout(function () {
                            $state.go('access.signin');
                        }, 3000);

                    }
                });
            }
        };

        $scope.updateParamsPdf = function (paramPdf) {
            uploader.uploadAll();
            paramPdf.idSociete = $scope.societe.idSociete;
            ServiceUtiles.updateParamsPdf(paramPdf).then(function () {
                notifyBox('Succès', 'Edition paramètres pdf ont été effectué avec succès', 'success');
            });

        };

        $scope.saveInfosGenerales = function (genrale) {
            if (genrale.idDefaultDevise === '' || genrale.idDefaultDevise === "undefined" || genrale.idDefaultTva === '' || genrale.idDefaultTva === "undefined") {
                var msg = "";
                if (genrale.idDefaultTva === '' || genrale.idDefaultTva === "undefined") {
                    msg = "Vous devez selectioner une tva";
                }
                if (genrale.idDefaultDevise === '' || genrale.idDefaultDevise === "undefined") {
                    msg = "Vous devez selectioner une devise";
                }
                notifyBox('Erreur', msg, 'danger');
            } else {
                genrale.idSociete = idSociete;
                ServiceUtiles.updateParamsGenrals(genrale).then(function () {
                    notifyBox('Succès', 'Edition paramètres général ont été effectué avec succès', 'success');
                });
            }
        };

        $scope.editionUser = function (subuser) {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'editSubUser.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'data', 'societe',
                    function ($scope, $modalInstance, scopeParent, data, societe) {
                        if ((data !== "") && (typeof data !== 'undefined')) {
                            $scope.subuser = {
                                idSociete: societe.idSociete,
                                idUser: data.idUser,
                                nom: data.nom,
                                prenom: data.prenom,
                                societeEmail: data.societeEmail,
                                login: data.login,
                                tel: data.tel,
                                photo: data.photo,
                                password: '',
                                confPassword: '',
                                mission: data.mission,
                                oper: data.oper,
                                listePermission: data.listePermission
                            };
                        }
                        $scope.editUser = function (subuser) {
                            var msg = checkDataSubUser(subuser);
                            if (msg !== '') {
                                notifyBox('Erreur', msg, 'error');
                            } else {
                                $scope.subuser.login = $scope.subuser.login + '@' + $scope.subuser.societeEmail;
                                ServiceUsers.saveSubUser($scope.subuser).then(function (response) {
                                    if (response.status === 'Failed') {
                                        notifyBox('Erreur', response.msg, 'error');
                                    } else {
                                        var permissions = [
                                            {client: subuser.listePermission[0].value},
                                            {fournisseur: subuser.listePermission[1].value},
                                            {article: subuser.listePermission[2].value},
                                            {stock: subuser.listePermission[3].value},
                                            {factureAchat: subuser.listePermission[4].value},
                                            {factureVente: subuser.listePermission[5].value},
                                            {commandeAchat: subuser.listePermission[6].value},
                                            {commandeVente: subuser.listePermission[7].value},
                                            {bonLivraisonAchat: subuser.listePermission[9].value},
                                            {bonLivraisonVente: subuser.listePermission[9].value},
                                            {paiement: subuser.listePermission[10].value},
                                            {idUser: response.idUser}
                                        ];
                                        permissions.oper = $scope.subuser.oper;
                                        ServiceUtiles.savePermission(permissions).then(function () {
                                            getSubUsers();
                                            notifyBox('Succès', 'Utilisateur : ' + $scope.subuser.nom + " " + $scope.subuser.prenom + ' ajouté avec succès', 'success');
                                            $modalInstance.close();
                                        });
                                    }
                                });

                            }

                        };
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                size: 'lg',
                resolve: {
                    scopeParent: function () {
                        return $scope;
                    },
                    societe: function () {
                        return $scope.societe;
                    },
                    data: function () {
                        var user;
                        if (typeof subuser === 'undefined') {
                            emptyUserData();
                            user = $scope.subuser;
                        } else {
                            
                            subuser.oper = 2;
                            ServiceUtiles.getPermission(subuser.idUser).then(function (data) {
                                
                                angular.forEach($scope.listePermission, function (permission) {

                                });
                            });
                            subuser.listePermission = $scope.listePermission;
                            user = subuser;
                        }
                        return user;
                    }
                }
            });
        };

        $scope.removeUser = function (idUser) {
            ServiceUtiles.deletePermission(idUser).then(function () {
                ServiceUsers.deleteUser(idUser).then(function (response) {
                    if (response.status === 'Failed') {
                        notifyBox('Erreur', response.msg, 'error');
                    } else {
                        angular.forEach($scope.ListeSubusers, function (subUser, index) {
                            if (subUser.idUser === idUser) {
                                $scope.ListeSubusers.splice(index, 1);
                                notifyBox('Succès', 'Supression utilisateur: ' + subUser.nom + ' ' + subUser.prenom + ' effectué avec succès', 'success');
                            }
                        });
                    }
                });
            });

        };

        $scope.oneAtATime = true;
        $scope.status1 = {
            open: true
        };

    }]);