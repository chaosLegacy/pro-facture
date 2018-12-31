'use strict';
/* Controllers */
// articles controller
app.controller('GesFactureVController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceFacture', 'ServiceClients', 'ServiceCommande', '$state', '$stateParams', '$timeout', '$filter', '$localStorage', '$modal', 'toaster', '$window', function ($scope, ServiceUtiles, ServiceHistorique, ServiceFacture, ServiceClients, ServiceCommande, $state, $stateParams, $timeout, $filter, $localStorage, $modal, toaster, $window) {
        var rootDir = $scope.app.rootDir;
        var idSociete = $scope.app.user.idSociete;
        var typeAbonement = $scope.app.user.typeAbonnement;
        var myAbonnement = abonnementChecker(typeAbonement);
        ServiceUtiles.getListEtats().then(function (data) {
            $scope.ListeEtats = data;
        });
        //get params General devise
        ServiceUtiles.getParamsGenrals(idSociete).then(function (general) {
            $scope.paramsGen = general;
            ServiceUtiles.getListDevise().then(function (devise) {
                $scope.ListeDevise = devise;
                angular.forEach($scope.ListeDevise, function (value) {
                    if ($scope.paramsGen.idDefaultDevise === value.idDevise) {
                        $scope.currency = value.label;
                    }
                });
            });
        });
        ServiceUtiles.getListunits().then(function (data) {
            $scope.ListeUnits = data;
        });
        ServiceUtiles.getListTva().then(function (data) {
            $scope.ListeTva = data;
        });
        ServiceClients.getListeClients(idSociete).then(function (data) {
            $scope.ListeClients = data;
        });

        ServiceCommande.getListeCommandeVenteEnCours(idSociete).then(function (data) {
            ServiceClients.getListeClients(idSociete).then(function (clients) {
                $scope.ListeCommandes = data;
                $scope.ListeClients = clients;
                angular.forEach($scope.ListeCommandes, function (commande) {
                    angular.forEach($scope.ListeClients, function (client) {
                        if (commande.idClient === client.idClient) {
                            commande.client = client.nom;
                        }
                    });
                    commande.isChecked = false;
                });
            });
        });

        function myStatue(status) {
            var response = "";
            angular.forEach($scope.ListeEtats, function (etat) {
                if (status === etat.idEtat) {
                    switch (status) {
                        case 0:
                            response = '';
                            break;
                        case 2:
                            $scope.ribon = etat.label;
                            $scope.color = 'ribbon-green';
                            response = etat.label;
                            break;
                        case 1:
                            $scope.ribon = etat.label;
                            $scope.color = 'ribbon-red';
                            response = etat.label;
                            break;
                    }
                }
            });
            return response;
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
        $scope.getStats = function (status) {
            return myStatue(status);
        };

        $scope.dateCre = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedCre = true;
        };
        function viderChampsFacture() {
            $scope.facture = {
                idFacture: "",
                reference: "FA-" + $scope.app.user.idUser + (Date.now() + "").substring(4, 15),
                dateCre: $filter("date")(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                description: "",
                totalallht: 0,
                status: 0,
                Oper: 1
            };
            $scope.commande = {
                ListeElements: []
            };
        }

        function getFacture(idFact) {
            if ((idFact !== "") && (typeof idFact !== 'undefined')) {
                ServiceFacture.getFactureVente(idFact).then(function (data) {
                    if (data !== "") {
                        $scope.facture = {
                            idFacture: data.idFacture,
                            idCommande: data.idCommande,
                            reference: data.reference,
                            dateCre: $filter("date")(new Date(data.date), 'yyyy-MM-dd hh:mm:ss'),
                            description: data.description,
                            totalallht: data.total,
                            status: data.idEtat,
                            Oper: 2
                        };
                        getCommande($scope.facture.idCommande);
                    }
                });
            }
        }

        function getCommande(idComm) {
            if ((idComm !== "") && (typeof idComm !== 'undefined')) {
                ServiceCommande.geCommandeVente(idComm).then(function (data) {
                    if (data !== "") {
                        angular.forEach(data.listeElments, function (element) {

                            angular.forEach($scope.ListeTva, function (tva) {
                                if (element.idTva === tva.idTva) {
                                    element.tva = tva.valeur;
                                }
                            });

                            angular.forEach($scope.ListeUnits, function (unite) {
                                if (element.idUnite === unite.idUnite) {
                                    element.unite = unite.label;
                                }
                            });

                        });

                        angular.forEach($scope.ListeClients, function (client) {
                            if (data.idClient === client.idClient) {
                                data.client = client.nom;
                            }
                        });

                        $scope.commande = {
                            idCommande: data.idCommVente,
                            reference: data.referenceCom,
                            dateCre: $filter("date")(new Date(data.date), 'yyyy-MM-dd'),
                            idClient: data.idClient,
                            client: data.client,
                            ListeElements: data.listeElments,
                            totalallht: data.total,
                            status: data.idEtat,
                            Oper: 2
                        };
                    }
                });
            }
        }

        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        }

        function checkData(facture) {
            if (facture.reference === '' || typeof (facture.reference) === "undefined") {
                return 'Reference obligatoire';
            }
            if (facture.dateCre === '' || typeof (facture.dateCre) === "undefined") {
                return 'Date obligatoire';
            }
            if ($scope.commande.ListeElements.length <= 0) {
                return 'La facture doit contenir au moins une commande';
            }
            ;
            return "";
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

        if (typeof $stateParams.idFact !== 'undefined' && $stateParams.idFact !== '') {
            viderChampsFacture();
            getFacture($stateParams.idFact);
        } else {
            viderChampsFacture();
        }

        $scope.back = function () {
            $state.go('app.factureVente');
        };
        $scope.addCommande = function () {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'monTemplate.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'data',
                    function ($scope, $modalInstance, scopeParent, data) {
                        $scope.currency = scopeParent.currency;
                        $scope.ListeCommandes = data;
                        $scope.getCommande = function () {
                            angular.forEach(data, function (commande) {
                                if (commande.isChecked) {
                                    scopeParent.commande.ListeElements.push(commande);
                                    commande.isChecked = false;
                                    scopeParent.commande = [];
                                    getCommande(commande.idCommVente);
                                }
                            });
                            $modalInstance.close();
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
                    data: function () {
                        return $scope.ListeCommandes;
                    }
                }
            });
        };

        $scope.apercuPDF = function () {
            var popup = $window.open('', '_blank');
            popup.document.write("Chargement...");
            ServiceUtiles.getSociete($scope.app.user.idSociete).then(function (societe) {
                ServiceUtiles.getParamsPdf(societe.idSociete).then(function (paramsPdf) {
                    $scope.societe = societe;
                    $scope.paramsPdf = paramsPdf;

                    angular.forEach($scope.ListeClients, function (client) {
                        if (client.idClient === $scope.commande.idClient) {
                            $scope.client = client;
                        }
                    });
                    var data = [
                        {client: []},
                        {facture: []},
                        {commande: []},
                        {societe: []},
                        {paramsPdf: []},
                        {currency: []},
                        {rootDir: []}
                    ];

                    data[0].client.push($scope.client);
                    data[1].facture.push($scope.facture);
                    data[2].commande.push($scope.commande);
                    data[3].societe.push($scope.societe);
                    data[4].paramsPdf.push($scope.paramsPdf);
                    data[5].currency.push($scope.currency);
                    data[6].rootDir.push(rootDir);

                    ServiceFacture.generatePDFFactureVente(data).then(function (href) {
                        popup.location = href;
                    });
                });
            });
        };

        $scope.saveFactureVente = function (facture) {
            ServiceFacture.countFacture(idSociete).then(function (data) {
                if (data.countFacture >= myAbonnement.maxFacturesCount && facture.Oper === 1) {
                    notifyBox("Erreur", "Vous avez atteint la limite de " + myAbonnement.maxFacturesCount + " fiches factures.\n Abonnez vous pour enlever cette limite.", 'warning');
                } else {
                    var msg = checkData(facture);
                    if (msg !== '') {
                        notifyBox('Erreur', msg, 'error');
                    } else {
                        facture.idSociete = idSociete;
                        facture.idCommande = $scope.commande.idCommande;
                        facture.totalallht = $scope.commande.totalallht;
                        facture.dateCre = $filter("date")(new Date(facture.dateCre), 'yyyy-MM-dd hh:mm:ss');
                        ServiceFacture.saveFactureVente(facture).then(function () {
                            if (facture.Oper === 1) {
                                interactHisto(facture.reference, 'factureVente', 56, '');
                                interactHisto($scope.commande.reference, 'commandeVente', 49, '');
                            } else {
                                interactHisto(facture.reference, 'factureVente', 57, '');
                            }
                            notifyBox('Succès', 'Edition Facture Vente: ' + facture.reference + ' effectué avec succès', 'success');
                            $timeout(function () {
                                viderChampsFacture();
                                $state.go('app.factureVente');
                            }, 800);
                        });
                    }
                }
            });


        };
    }]);