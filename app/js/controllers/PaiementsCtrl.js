'use strict';

/* Controllers */
// articles controller
app.controller('PaiementsController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServicePaiements', 'ServiceFacture', 'ServiceFournisseurs', 'ServiceClients', '$state', '$timeout', '$filter', '$modal', 'toaster', function ($scope, ServiceUtiles, ServiceHistorique, ServicePaiements, ServiceFacture, ServiceFournisseurs, ServiceClients, $state, $timeout, $filter, $modal, toaster) {
        var idSociete = $scope.app.user.idSociete;
        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
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
        // get liste mode paiements
        ServiceUtiles.getListModePaiements().then(function (data) {
            $scope.ListModePaiements = data;
        });
        // get liste fournisseurs
        ServiceFournisseurs.getListeFouenisseurs(idSociete).then(function (data) {
            $scope.ListeFournisseurs = data;
        });
        // get liste clients
        ServiceClients.getListeClients(idSociete).then(function (data) {
            $scope.ListeClients = data;
        });

        // get liste paiements
        function getListePaiements() {
            ServicePaiements.getListePaiements(idSociete).then(function (data) {
                $scope.ListPaiements = data;
                angular.forEach($scope.ListPaiements, function (paiement) {
                    if (paiement.idClient !== null) {
                        paiement.clientFour = paiement.nomClient;
                    } else if (paiement.idFournisseur !== null) {
                        paiement.clientFour = paiement.nomFournisseur;
                    }
                });
            });
        }
        getListePaiements();


        // get liste facture achats
        function getImpyedFactureAchat() {
            ServiceFacture.getImpyedFactureAchat(idSociete).then(function (data) {
                ServiceFournisseurs.getListeFouenisseurs(idSociete).then(function (fournisseurs) {
                    $scope.ListeFacturesA = data;
                    $scope.ListeFournisseurs = fournisseurs;
                    angular.forEach($scope.ListeFacturesA, function (facture) {
                        angular.forEach($scope.ListeFournisseurs, function (fournisseur) {
                            if (facture.idFournisseur === fournisseur.idFournisseur) {
                                facture.fournisseur = fournisseur.nom;
                            }
                        });
                    });
                });
            });
        }
        getImpyedFactureAchat();


        // get liste factures ventes
        function getImpyedFactureVente() {
            ServiceFacture.getImpyedFactureVente(idSociete).then(function (data) {
                ServiceClients.getListeClients(idSociete).then(function (clients) {
                    $scope.ListeFacturesV = data;
                    $scope.ListeClients = clients;
                    angular.forEach($scope.ListeFacturesV, function (facture) {
                        angular.forEach($scope.ListeClients, function (client) {
                            if (facture.idClient === client.idClient) {
                                facture.client = client.nom;
                            }
                        });
                    });
                });
            });
        }
        getImpyedFactureVente();

        // trier les clients croissant décroissant 
        $scope.sort = [
            {label: 'clientFour'},
            {label: 'date'},
            {label: 'montant'}
        ];
        $scope.reverse = false;
        $scope.orderBy = function (value) {
            angular.forEach($scope.sort, function (data) {
                if (data.label === value) {
                    $scope.reverse = !$scope.reverse;
                    return;
                }
            });
            $scope.sort.label = value;
        };

        function emptyDataFactureVente() {
            $scope.factureV = {
                reference: "",
                idClient: "",
                idEtat: 0
            };
        }

        function emptyDataFactureAchat() {
            $scope.factureA = {
                reference: "",
                idFournisseur: "",
                idEtat: 0
            };
        }

        function emptyDataPaiement() {
            $scope.paiement = {
                refPaiement: "",
                idFactureA: "",
                idFactureV: "",
                idFournisseur: "",
                idCli: "",
                datePaiement: $filter("date")(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                idMode: 1, //Espèce
                montant: 0,
                description: "Paiement facture ",
                Oper: 1
            };
        }
        emptyDataFactureVente();
        emptyDataFactureAchat();
        emptyDataPaiement();

        $scope.ListePaiements = [];

        function checkDataPaiement(paiement) {
            if (paiement.idFactureA === '' && paiement.idFactureV === '') {
                return 'Vous devez choisir une référence dans la liste des paiements';
            }
            if (paiement.montant == 0 || paiement.montant === '') {
                return 'Montant obligatoire';
            } else if (isNaN(paiement.montant)) {
                return 'Seule les chiffres sont permis';
            } else if (paiement.montant < 0) {
                return 'Montant incorrect esseayez a nouveau';
            } else if (paiement.montant > paiement.totalFacture) {
                return 'Vous avez dépasser le montat demandé';
            }

            return '';
        }
        function factureSommePaiements(idFacture, lastMontant) {
            var sommePaiements = 0;
            angular.forEach($scope.ListPaiements, function (paiement) {
                if (paiement.idFacture === idFacture) {
                    sommePaiements += paiement.montant;
                }
            });
            sommePaiements = sommePaiements + lastMontant;
            return sommePaiements;
        }
        $scope.addPaiementEntrant = function () {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'paiementEntrant.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'paiement', 'facture',
                    function ($scope, $modalInstance, scopeParent, paiement, facture) {

                        $scope.currency = scopeParent.currency;
                        $scope.ListModePaiements = scopeParent.ListModePaiements;
                        $scope.paiement = paiement;
                        $scope.factureV = facture;

                        $scope.datePaiement = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.openedCre = true;
                        };

                        $scope.ListePaiementEntrant = function () {
                            scopeParent.listePaiementEntrant();
                        };
                        $scope.validerFichePaiement = function (paiement) {
                            var msg = checkDataPaiement(paiement);
                            if (msg !== '') {
                                notifyBox("Erreur", msg, 'warning');
                            } else {
                                var obj = {
                                    reference: "P-" + scopeParent.app.user.idUser + (Date.now() + "").substring(4, 15),
                                    idFacture: paiement.idFactureV,
                                    idSociete: idSociete,
                                    idMode: paiement.idMode,
                                    idType: 1,
                                    idClient: paiement.idClient,
                                    datePaiement: $filter("date")(new Date(paiement.datePaiement), 'yyyy-MM-dd hh:mm:ss'),
                                    description: paiement.description,
                                    montant: paiement.montant
                                };
                                savePaiement(obj);
                                
                                var montant = numeral(obj.montant).format('0,0.00')+ ' '+scopeParent.currency;
                                interactHisto(scopeParent.factureV.reference, 'paiement', 58, montant);
                                if (factureSommePaiements(obj.idFacture, obj.montant) === paiement.totalFacture) {
                                    interactHisto(scopeParent.factureV.reference, 'paiement', 60, montant);
                                    var facture = {
                                        idFacture: obj.idFacture,
                                        idEtat: 2
                                    };
                                    ServiceFacture.updateFactureVenteStatus(facture).then(function () {
                                        getImpyedFactureVente();
                                    });
                                }
                                emptyDataFactureVente();
                                emptyDataPaiement();
                                $modalInstance.close();
                            }
                        };
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                resolve: {
                    scopeParent: function () {
                        return $scope;
                    },
                    paiement: function () {
                        return $scope.paiement;
                    },
                    facture: function () {
                        return $scope.factureV;
                    }
                }
            });
        };

        $scope.listePaiementEntrant = function () {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'listePaiementEntrant.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'data', 'paiement', 'factureV',
                    function ($scope, $modalInstance, scopeParent, data, paiement, factureV) {
                        $scope.currency = scopeParent.currency;
                        $scope.ListeFactures = data;
                        $scope.getFacture = function (facture) {
                            emptyDataPaiement();
                            paiement.idFactureV = facture.idFacture;
                            factureV.reference = facture.reference;
                            factureV.idClient = facture.idClient;
                            factureV.idEtat = facture.idEtat;
                            paiement.totalFacture = facture.total * 1;
                            paiement.montant = facture.restApayer * 1;
                            paiement.description = 'Paiement facture ';
                            paiement.description += ' vente N° ' + facture.reference;
                            scopeParent.paiement = paiement;
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
                        return $scope.ListeFacturesV;
                    },
                    paiement: function () {
                        return $scope.paiement;
                    },
                    factureV: function () {
                        return $scope.factureV;
                    }
                }
            });
        };

        $scope.addPaiementSortant = function () {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'paiementSortant.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'paiement', 'facture',
                    function ($scope, $modalInstance, scopeParent, paiement, facture) {

                        $scope.currency = scopeParent.currency;
                        $scope.ListModePaiements = scopeParent.ListModePaiements;
                        $scope.paiement = paiement;
                        $scope.factureA = facture;

                        $scope.datePaiement = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.openedCre = true;
                        };

                        $scope.ListePaiementSortant = function () {
                            scopeParent.listePaiementSortant();
                        };
                        $scope.validerFichePaiement = function (paiement) {
                            var msg = checkDataPaiement(paiement);
                            if (msg !== '') {
                                notifyBox("Erreur", msg, 'warning');
                            } else {
                                var obj = {
                                    reference: "P-" + scopeParent.app.user.idUser + (Date.now() + "").substring(4, 15),
                                    idFacture: paiement.idFactureA,
                                    idSociete: idSociete,
                                    idMode: paiement.idMode,
                                    idType: 0,
                                    idClient: paiement.idClient,
                                    datePaiement: $filter("date")(new Date(paiement.datePaiement), 'yyyy-MM-dd hh:mm:ss'),
                                    description: paiement.description,
                                    montant: paiement.montant
                                };
                                savePaiement(obj);
                                var montant = numeral(obj.montant).format('0,0.00')+ ' '+scopeParent.currency;
                                interactHisto(scopeParent.factureA.reference, 'paiement', 58, montant);
                                if (factureSommePaiements(obj.idFacture, obj.montant) === paiement.totalFacture) {
                                    var facture = {
                                        idFacture: obj.idFacture,
                                        idEtat: 2
                                    };
                                    ServiceFacture.updateFactureAchatStatus(facture).then(function () {
                                        getImpyedFactureAchat();
                                        interactHisto(scopeParent.factureA.reference, 'paiement', 60, montant);
                                    });
                                }
                                emptyDataFactureVente();
                                emptyDataPaiement();
                                $modalInstance.close();
                            }
                        };
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                resolve: {
                    scopeParent: function () {
                        return $scope;
                    },
                    paiement: function () {
                        return $scope.paiement;
                    },
                    facture: function () {
                        return $scope.factureA;
                    }
                }
            });
        };

        $scope.listePaiementSortant = function () {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'listePaiementSortant.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'data', 'paiement', 'factureA',
                    function ($scope, $modalInstance, scopeParent, data, paiement, factureA) {
                        $scope.currency = scopeParent.currency;
                        $scope.ListeFactures = data;
                        $scope.getFacture = function (facture) {
                            emptyDataPaiement();
                            paiement.idFactureA = facture.idFacture;
                            factureA.reference = facture.reference;
                            factureA.idFournisseur = facture.idFournisseur;
                            factureA.idEtat = facture.idEtat;
                            paiement.totalFacture = facture.total * 1;
                            paiement.montant = facture.restApayer * 1;
                            paiement.description = 'Paiement facture ';
                            paiement.description += ' achat N° ' + facture.reference;
                            scopeParent.paiement = paiement;
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
                        return $scope.ListeFacturesA;
                    },
                    paiement: function () {
                        return $scope.paiement;
                    },
                    factureA: function () {
                        return $scope.factureA;
                    }
                }
            });
        };

        function savePaiement(paiement) {
            paiement.idSociete = idSociete;
            ServicePaiements.savePaiement(paiement).then(function () {
                getListePaiements();
                notifyBox('Succès', 'Paiement : ' + paiement.reference + ' ajouté avec succès', 'success');
                getImpyedFactureVente();
                getImpyedFactureAchat();
            });
        }

        $scope.deletePaiement = function (idPaiement) {
            ServicePaiements.deletePaiement(idPaiement).then(function () {
                angular.forEach($scope.ListPaiements, function (paiement, index) {
                    if (paiement.idPaiement === idPaiement) {
                        var facture = {
                            idFacture: paiement.idFacture,
                            idEtat: 0
                        };
                        if (paiement.idType === 1) {//vente
                            ServiceFacture.updateFactureVenteStatus(facture).then(function () {
                                getImpyedFactureVente();
                            });
                            angular.forEach($scope.ListeFacturesV, function(factV){
                               if(factV.idFacture === facture.idFacture) {
                                   var montant = numeral(paiement.montant).format('0,0.00')+ ' '+$scope.currency;
                                   interactHisto(factV.reference, 'paiement', 59, montant);
                               } 
                            });
                        } else {//achat
                            ServiceFacture.updateFactureAchatStatus(facture).then(function () {
                                getImpyedFactureAchat();
                            });
                            angular.forEach($scope.ListeFacturesA, function(factA){
                               if(factA.idFacture === facture.idFacture) {
                                   var montant = numeral(paiement.montant).format('0,0.00')+ ' '+$scope.currency;
                                   interactHisto(factA.reference, 'paiement', 59, montant);
                               } 
                            });
                        }
                        $scope.ListPaiements.splice(index, 1);
                        notifyBox('Succès', 'Supression paiement: ' + paiement.reference + ' effectué avec succès', 'success');
                        getImpyedFactureVente();
                        getImpyedFactureAchat();

                    }
                });
            });
        };

    }]);