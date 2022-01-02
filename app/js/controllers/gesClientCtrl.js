'use strict';

/* Controllers */
// gestion client controller
app.controller('GesClientsController', ['$scope', 'ServiceClients', 'ServiceHistorique', '$state', '$stateParams', '$timeout', '$localStorage', 'toaster', function ($scope, ServiceClients, ServiceHistorique, $state, $stateParams, $timeout, $localStorage, toaster) {
        var idSociete = $scope.app.user.idSociete;
        var typeAbonement = $scope.app.user.typeAbonnement;
        var myAbonnement = abonnementChecker(typeAbonement);
        function viderChampsClient() {
            $scope.client = {
                idClient: "",
                reference: "CL-" + $scope.app.user.idUser + (Date.now() + "").substring(4, 15),
                nom: "",
                idType: 0,
                type: getTypeClient(0),
                tel: "",
                fax: "",
                email: "",
                rueF: "",
                villeF: "",
                codePF: "",
                paysF: "",
                rueL: "",
                villeL: "",
                codePL: "",
                paysL: "",
                Oper: 1
            };
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
        function getClient(idCli) {
            if ((idCli !== "") && (typeof idCli !== 'undefined')) {
                ServiceClients.getClient(idCli).then(function (data) {
                    $scope.client = {
                        "reference": data.reference,
                        "idClient": data.idClient,
                        "nom": data.nom,
                        "idType": data.idType,
                        "type": getTypeClient(data.idType),
                        "tel": data.tel,
                        "fax": data.fax,
                        "email": data.email,
                        "rueF": data.rueF,
                        "villeF": data.villeF,
                        "codePF": data.codePF,
                        "paysF": data.paysF,
                        "faxF": data.faxF,
                        "rueL": data.rueL,
                        "villeL": data.villeL,
                        "codePL": data.codePL,
                        "paysL": data.paysL,
                        "faxL": data.faxL,
                        "Oper": 2
                    };
                });
            }
        }

        function getTypeClient(idType) {
            var type = '';
            switch (idType) {
                case 0:
                    type = 'Sociéte';
                    break;
                case 1:
                    type = 'Particulies';
                    break;
            }

            return type;
        }

        $scope.ListeTypes = [
            {idType: 0, label: 'Sociéte'},
            {idType: 1, label: 'Particulies'}
        ];

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
            if ($scope.client.Oper === 1) {
                if ($scope.client.reference === '') {
                    return 'Réference client obligatoire';
                }
                if ($scope.client.reference.length >= 30) {
                    return 'Réference Maximum 30 char';
                }
            }

            if ($scope.client.nom === '') {
                return 'Nom client obligatoire';
            } else if ($scope.client.nom.length >= 100) {
                return 'Nom Maximum 100 char';
            } else {
                var vrfNom = new RegExp("^[a-zA-Z0-9 ]+$", "g");
                if (!vrfNom.test($scope.client.nom)) {
                    return "Le nom doit contenir seulement des caractères alpha-numérique ";
                }
            }
            if ($scope.client.tel !== '') {

                if ($scope.client.tel.length >= 30) {
                    return 'Telephone Maximum 30 char';
                }
            }
            if ($scope.client.fax !== '') {

                if ($scope.client.fax.length >= 30) {
                    return 'Fax Maximum 30 char';
                }
            }
            if ($scope.client.email !== '') {

                if (!validateEmail($scope.client.email))
                {
                    return 'Adresse email invalide!!!';
                }
            }
            // Adresse Facturation VAlidation

            if ($scope.client.rueF !== '') {

                if ($scope.client.rueF.length >= 50) {
                    return 'Rue Maximum 50 char';
                }
            }
            if ($scope.client.villeF !== '') {

                if ($scope.client.villeF.length >= 30) {
                    return 'Ville Maximum 30 char';
                }
            }
            if ($scope.client.codePF !== '') {

                if ($scope.client.codePF.length >= 20) {
                    return 'Code postal Maximum 20 char';
                }
            }
            if ($scope.client.paysF !== '') {

                if ($scope.client.paysF.length >= 30) {
                    return 'Pays Maximum 30 char';
                }
            }
            // Adresse Livraison VAlidation

            if ($scope.client.rueL !== '') {

                if ($scope.client.rueL.length >= 50) {
                    return 'Rue Maximum 50 char';
                }
            }
            if ($scope.client.villeL !== '') {

                if ($scope.client.villeL.length >= 30) {
                    return 'Ville Maximum 30 char';
                }
            }
            if ($scope.client.codePL !== '') {

                if ($scope.client.codePL.length >= 20) {
                    return 'Code postal Maximum 20 char';
                }
            }
            if ($scope.client.paysL !== '') {

                if ($scope.client.paysL.length >= 30) {
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

        if (typeof $stateParams.idCli !== 'undefined' && $stateParams.idCli !== '') {
            viderChampsClient();
            getClient($stateParams.idCli);
        } else {
            viderChampsClient();
        }

        $scope.back = function () {
            $state.go('app.clients');
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

        $scope.updateClient = function (idCli) {
            $state.go('app.gesClient', {idCli: idCli});
        };

        $scope.toggleDeliveryAdd = function () {
            $scope.delivryAdd = !$scope.delivryAdd;

            if ($scope.delivryAdd == true) {
                $scope.client.rueL = $scope.client.rueF;
                $scope.client.villeL = $scope.client.villeF;
                $scope.client.codePL = $scope.client.codePF;
                $scope.client.paysL = $scope.client.paysF;
                $scope.client.faxL = $scope.client.faxF;
            } else {
                $scope.client.rueL = "";
                $scope.client.villeL = "";
                $scope.client.codpL = "";
                $scope.client.paysL = "";
                $scope.client.faxL = "";
            }

        };

        $scope.saveClient = function () {
            ServiceClients.countClient(idSociete).then(function (data) {
                if (data.countClient >= myAbonnement.maxClientsCount && $scope.client.Oper === 1) {
                    notifyBox("Erreur", "Vous avez atteint la limite de " + myAbonnement.maxClientsCount + " fiches clients.\n Abonnez vous pour enlever cette limite.", 'warning');
                } else {
                    var msg = checkData();
                    if (msg !== '') {
                        notifyBox('Erreur', msg, 'error');
                    } 
                    else {
                        $scope.client.idSociete = idSociete;
                        ServiceClients.saveClient($scope.client).then(function () {

                            if ($scope.client.Oper === 1) {
                                interactHisto($scope.client.nom, 'client', 0, '');
                            } else {
                                interactHisto($scope.client.nom, 'client', 1, '');
                            }
                            notifyBox('Succès', 'Edition Client: ' + $scope.client.reference + ' effectué avec succès', 'success');


                            $timeout(function () {
                                viderChampsClient();
                                $state.go('app.clients');
                            }, 800);

                        });
                    }
                }
            });

        };

    }]);