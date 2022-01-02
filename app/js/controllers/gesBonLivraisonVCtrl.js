'use strict';
/* Controllers */
// BonLivraison vente controller
app.controller('GesBonLivraisonAController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceBonLivraison', 'ServiceClients', 'ServiceCommande', '$state', '$stateParams', '$timeout', '$filter', '$localStorage', '$modal', 'toaster', function ($scope, ServiceUtiles, ServiceHistorique, ServiceBonLivraison, ServiceClients, ServiceCommande, $state, $stateParams, $timeout, $filter, $localStorage, $modal, toaster) {
        var idSociete = $scope.app.user.idSociete;
        ServiceUtiles.getListunits().then(function (data) {
            $scope.ListeUnits = data;
        });
        ServiceUtiles.getListTva().then(function (data) {
            $scope.ListeTva = data;
        });
        ServiceClients.getListeClients(idSociete).then(function (data) {
            $scope.ListeClients = data;
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

        $scope.dateCre = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedCre = true;
        };
        function viderChampsBonLivraison() {
            $scope.bonLivraison = {
                idBonLivraison: "",
                reference: "BL-" + $scope.app.user.idUser + (Date.now() + "").substring(4, 15),
                dateCre: $filter("date")(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                description: "",
                totalallht: 0,
                attachement: '',
                Oper: 1
            };
            $scope.commande = {
                ListeElements: []
            };
        }

        function getBonLivraison(idBL) {
            if ((idBL !== "") && (typeof idBL !== 'undefined')) {
                ServiceBonLivraison.getBonLivraisonVente(idBL).then(function (data) {
                    if (data !== "") {
                        $scope.bonLivraison = {
                            idBonLivraison: data.idBonLivraison,
                            idCommande: data.idCommande,
                            reference: data.reference,
                            dateCre: $filter("date")(new Date(data.date), 'yyyy-MM-dd hh:mm:ss'),
                            description: data.description,
                            attachement: data.attachement,
                            totalallht: data.total,
                            Oper: 2
                        };
                        
                        getCommande($scope.bonLivraison.idCommande);
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

        function checkData(bonLivraison) {
            var errorHandler = "";
            if (bonLivraison.reference === '' || typeof (bonLivraison.reference) === "undefined") {
                return 'Reference obligatoire';
            }
            if (bonLivraison.dateCre === '' || typeof (bonLivraison.dateCre) === "undefined") {
                return 'Date obligatoire';
            }
            if ($scope.commande.ListeElements.length <= 0) {
                return 'La bon de livraison doit contenir au moins une commande à validé';
            }
            
            angular.forEach($scope.ListeArticles, function (article) {
                angular.forEach(bonLivraison.ListeElements, function (element) {
                    if (article.idArticle === element.idArticle) {
                        
                        if (element.qte <= 0 || element.qte === '' || isNaN(element.qte)) {
                            element.qte = 0;
                            errorHandler = 'La quantité de l\'article : ' + element.reference + " est invalide";
                        } else if (element.qte > article.qteTmp) {
                            errorHandler = 'Vous avez dépasser la quantité permis concernant l\'article : ' + element.reference;
                        }
                    }
                });
            });
            return errorHandler;
            
            return "";
        }

        if (typeof $stateParams.idBL !== 'undefined' && $stateParams.idBL !== '') {
            viderChampsBonLivraison();
            getBonLivraison($stateParams.idBL);
        } else {
            viderChampsBonLivraison();
        }

        $scope.back = function () {
            $state.go('app.bonLivraisonVente');
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

        $scope.saveBonLivraisonVente = function (bonLivraison) {
            
            var msg = checkData(bonLivraison);
            if (msg !== '')
            {
                notifyBox('Erreur', msg, 'error');
            } else
            {
                $scope.bonLivraison.idSociete = idSociete;
                $scope.bonLivraison.idCommande = $scope.commande.idCommande;
                $scope.bonLivraison.totalallht = $scope.commande.totalallht;
                $scope.bonLivraison.dateCre = $filter("date")(new Date($scope.bonLivraison.dateCre), 'yyyy-MM-dd hh:mm:ss');
                ServiceBonLivraison.saveBonLivraisonVente(bonLivraison).then(function () {
                    if (bonLivraison.Oper === 1) {
                        interactHisto(bonLivraison.reference, 'bonLivraisonVente', 65, $scope.commande.reference);
                        interactHisto($scope.commande.reference, 'commandeVente', 50, '');
                        angular.forEach($scope.commande.ListeElements, function(element){
                            interactHisto(element.reference, 'stock', 19, element.qte+" "+element.unite);
                            if(element.qte <= 5) {
                              interactHisto(element.reference, 'stock', 20, element.qte+" "+element.unite);  
                            }
                        });
                    } else {
                        interactHisto(bonLivraison.reference, 'bonLivraisonVente', 66, $scope.commande.reference);
                    }
                    notifyBox('Succès', 'Edition BonLivraison Vente: ' + bonLivraison.reference + ' effectué avec succès', 'success');
                    $timeout(function () {
                        viderChampsBonLivraison();
                        $state.go('app.bonLivraisonVente');
                    }, 800);
                });
            }

        };
    }]);