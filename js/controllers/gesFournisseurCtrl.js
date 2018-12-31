'use strict';

/* Controllers */
// fournisseurs controller
app.controller('GesFournisseursController', ['$scope', 'ServiceFournisseurs', 'ServiceHistorique', '$state', '$stateParams', '$timeout', 'toaster', function ($scope, ServiceFournisseurs, ServiceHistorique, $state, $stateParams, $timeout, toaster) {
        var idSociete = $scope.app.user.idSociete;
        var typeAbonement = $scope.app.user.typeAbonnement;
        var myAbonnement = abonnementChecker(typeAbonement);
        function viderChampsFournisseur() {
            $scope.fournisseur = {
                "idFournisseur": "",
                "reference": "F-" + $scope.app.user.idUser + (Date.now() + "").substring(4, 15),
                "nom": "",
                "tel": "",
                "fax": "",
                "email": "",
                "rue": "",
                "ville": "",
                "codeP": "",
                "pays": "",
                "Oper": 1
            };
        }

        function getFournisseur(idFour) {
            if ((idFour !== "") && (typeof idFour !== 'undefined')) {
                ServiceFournisseurs.getFournisseur(idFour).then(function (data) {
                    $scope.fournisseur = {
                        "reference": data.reference,
                        "idFournisseur": data.idFournisseur,
                        "nom": data.nom,
                        "tel": data.tel,
                        "fax": data.fax,
                        "email": data.email,
                        "rue": data.rue,
                        "ville": data.ville,
                        "codeP": data.codeP,
                        "pays": data.pays,
                        "Oper": 2
                    };
                });
            }
        }
        function abonnementChecker(type) {
            var abonnement = null;
            switch (type) {
                case 0:
                    abonnement = $scope.app.abonnements.standard;
                    break;
                case 1:
                    abonnement = $scope.app.abonnements.business;
                    break;
                case 2:
                    abonnement = $scope.app.abonnements.premium;
                    break;
            }
            return abonnement;
        }
        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        }

        function checkData() {
            if ($scope.fournisseur.Oper === 1) {
                if ($scope.fournisseur.reference === '') {
                    return 'Réference fournisseur obligatoire';
                }
                if ($scope.fournisseur.reference.length >= 30) {
                    return 'Réference Maximum 30 char';
                }
            }

            if ($scope.fournisseur.nom === '') {
                return 'Nom fournisseur obligatoire';
            } else if ($scope.fournisseur.nom.length >= 100) {
                return 'Nom Maximum 100 char';
            } else {
                var vrfNom = new RegExp("^[a-zA-Z0-9 ]+$", "g");
                if (!vrfNom.test($scope.fournisseur.nom)) {
                    return "Le nom doit contient seulement des caractères alpha-numérique ";
                }
            }
            if ($scope.fournisseur.tel !== '') {

                if ($scope.fournisseur.tel.length >= 30) {
                    return 'Telephone Maximum 30 char';
                }
            }
            if ($scope.fournisseur.fax !== '') {

                if ($scope.fournisseur.fax.length >= 30) {
                    return 'Fax Maximum 30 char';
                }
            }
            if ($scope.fournisseur.email !== '') {

                if (!validateEmail($scope.fournisseur.email))
                {
                    return 'Adresse email invalide!!!';
                }
            }
            // Adresse Facturation VAlidation

            if ($scope.fournisseur.rue !== '') {

                if ($scope.fournisseur.rue.length >= 50) {
                    return 'Rue Maximum 50 char';
                }
            }
            if ($scope.fournisseur.ville !== '') {

                if ($scope.fournisseur.ville.length >= 30) {
                    return 'Ville Maximum 30 char';
                }
            }
            if ($scope.fournisseur.codeP !== '') {

                if ($scope.fournisseur.codeP.length >= 20) {
                    return 'Code postal Maximum 20 char';
                }
            }
            if ($scope.fournisseur.pays !== '') {

                if ($scope.fournisseur.pays.length >= 30) {
                    return 'Pays Maximum 30 char';
                }
            }

            return '';
        }
        
        function interactHisto(idObjet, typeHisto, typeAction, data) {
            var datAuj = new Date();
            var today = Date.parse(datAuj);
            var historique = {
                idSociete: idSociete,
                idUser: $scope.app.user.idUser,
                idObjet: idObjet,
                typeHisto: typeHisto,
                typeAction: typeAction,
                data: data,
                dateAction: today
            };
            ServiceHistorique.saveHistorique(historique);
        }
        
        if (typeof $stateParams.idFour !== 'undefined' && $stateParams.idFour !== '') {
            viderChampsFournisseur();
            getFournisseur($stateParams.idFour);
        } else {
            viderChampsFournisseur();
        }

        $scope.back = function () {
            $state.go('app.fournisseurs');
        };
        $scope.validateEmail = function (email) {
            return validateEmail(email);
        };
        $scope.CallTel = function (tel) {
            window.open('tel:' + tel, '_system');
        };
        $scope.sendEmail = function (email, subject, body) {
            console.log(email);
            var link = "mailto:" + email;
            window.open('mailto:' + email, '_system');
        };
        $scope.updateFournisseur = function (idFour) {
            $state.go('app.gesFournisseur', {idFour: idFour});
        };
        $scope.saveFournisseur = function () {
            ServiceFournisseurs.countFournisseur(idSociete).then(function (data) {
                if(data.countFournisseur >= myAbonnement.maxFournisseursCount && $scope.fournisseur.Oper === 1) {
                    notifyBox("Erreur", "Vous avez atteint la limite de "+ myAbonnement.maxFournisseursCount + " fiches fournisseurs.\n Abonnez vous pour enlever cette limite.",'warning');
                } else {
                    var msg = checkData();
                    if (msg !== '') {
                        notifyBox('Erreur', msg, 'error');
                    } else {
                        $scope.fournisseur.idSociete = idSociete;
                        ServiceFournisseurs.saveFournisseur($scope.fournisseur).then(function () {
                            if ($scope.fournisseur.Oper === 1) {
                                interactHisto($scope.fournisseur.nom, 'fournisseur', 6, '');
                            } else {
                                interactHisto($scope.fournisseur.nom, 'fournisseur', 7, '');
                            }
                            notifyBox('Succès', 'Edition Fournisseur: ' + $scope.fournisseur.reference + ' effectué avec succès', 'success');

                            $timeout(function () {
                                viderChampsFournisseur();
                                $state.go('app.fournisseurs');
                            }, 800);
                        });
                    }
                }
            });
            
        };
    }]);