'use strict';

/* Controllers */
// articles controller
app.controller('GesCommandeVController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceArticles', 'ServiceClients', 'ServiceCommande', '$state', '$stateParams', '$timeout', '$filter', '$localStorage', '$modal', 'toaster', '$window', function ($scope, ServiceUtiles, ServiceHistorique, ServiceArticles, ServiceClients, ServiceCommande, $state, $stateParams, $timeout, $filter, $localStorage, $modal, toaster, $window) {
        var rootDir = $scope.app.rootDir;
        var idSociete = $scope.app.user.idSociete;
        var typeAbonement = $scope.app.user.typeAbonnement;
        var myAbonnement = abonnementChecker(typeAbonement);
        ServiceUtiles.getListEtats().then(function (data) {
            $scope.ListeEtats = data;
        });

        ServiceUtiles.getListTva().then(function (data) {
            $scope.ListeTva = data;
        });

        ServiceUtiles.getListunits().then(function (data) {
            $scope.Listeunits = data;
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
        ServiceArticles.getListeArticles(idSociete).then(function (data) {
            $scope.ListeArticles = [];
            angular.forEach(data, function (article) {
                angular.forEach($scope.ListeTva, function (tva) {
                    if (tva.idTva === article.idTva) {
                        article.tva = tva.valeur;
                    }
                });
                if (article.qte > 0) {
                    $scope.ListeArticles.push(article);
                }
                article.isChecked = false;
                article.total = 0;
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
                        case 3:
                            $scope.ribon = etat.label;
                            $scope.color = 'ribbon-purple';
                            response = etat.label;
                            break;
                        case 4:
                            $scope.ribon = etat.label;
                            $scope.color = 'ribbon-green';
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

        $scope.getInfoClients = function (idClient) {
            $scope.getAdressClients = ' \n ';
            angular.forEach($scope.ListeClients, function (client) {
                if (typeof (client.idClient) !== 'undefined' && client.idClient === idClient) {
                    $scope.client = client;
                    $scope.getAdressClients = (client.rueF === "null" ? '' : client.rueF) + " " + (client.codePF === "null" ? '' : client.codePF) + "\n" + (client.villeF === "null" ? '' : client.villeF) + " " + (client.paysF === "null" ? '' : client.paysF);
                }
            });
        };

        $scope.dateCre = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedCre = true;
        };

        function viderChampsCommande() {
            $scope.commande = {
                idCommande: "",
                reference: "CV-" + $scope.app.user.idUser + (Date.now() + "").substring(4, 15),
                dateCre: $filter("date")(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                idClient: "",
                ListeElements: [],
                totalallht: 0,
                totalalltva: 0,
                totalttc: 0,
                status: 0,
                Oper: 1
            };
        }

        function getCommande(idComm) {
            if ((idComm !== "") && (typeof idComm !== 'undefined')) {
                ServiceCommande.geCommandeVente(idComm).then(function (data) {
                    ServiceUtiles.getListTva().then(function (allTva) {
                        $scope.ListeTva = allTva;
                        if (data !== "") {
                            $scope.commande = {
                                idCommande: data.idCommVente,
                                reference: data.referenceCom,
                                dateCre: $filter("date")(new Date(data.date), 'yyyy-MM-dd'),
                                idClient: data.idClient,
                                ListeElements: data.listeElments,
                                totalallht: 0,
                                totalalltva: 0,
                                totalttc: 0,
                                status: data.idEtat,
                                Oper: 2
                            };
                            $scope.getInfoClients($scope.commande.idClient);
                            calculer();
                        }
                    });
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

        function checkData(commande) {
            var errorHandler = "";
            if (commande.reference === '' || typeof (commande.reference) === "undefined") {
                return 'Reference obligatoire';
            }
            if (commande.idClient === '' || typeof (commande.idClient) === "undefined") {
                return 'Client obligatoire';
            }
            if (commande.dateCre === '' || typeof (commande.dateCre) === "undefined") {
                return 'Date obligatoire';
            }
            if (commande.ListeElements.length <= 0) {
                return 'La commande doit contenir au moins un élément';
            }
            angular.forEach($scope.ListeArticles, function (article) {
                angular.forEach(commande.ListeElements, function (element) {
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

        if (typeof $stateParams.idComm !== 'undefined' && $stateParams.idComm !== '') {
            viderChampsCommande();
            getCommande($stateParams.idComm);
        } else {
            viderChampsCommande();
        }

        $scope.back = function () {
            $state.go('app.commandeVente');
        };
        function calculer() {
            if ($scope.commande.ListeElements.length > 0) {
                var totalallht = 0;
                var totalttc = 0;
                var totaltva = 0;
                angular.forEach($scope.commande.ListeElements, function (artComm) {
                    if (!isNaN(artComm.qte) && artComm.qte != '' && !isNaN(artComm.prixA) && artComm.prixA != '') {
                        angular.forEach($scope.ListeTva, function (tva) {
                            if (tva.idTva === artComm.idTva) {
                                artComm.tva = tva.valeur;
                                totalallht += parseFloat(artComm.prixA) * parseInt(artComm.qte);
                                totaltva += parseFloat(artComm.prixA) * parseInt(artComm.qte) * (artComm.tva / 100);
                                totalttc = totalallht + totaltva;
                            }
                        });
                    }
                });
                $scope.commande.totalallht = totalallht;
                $scope.commande.totalalltva = totaltva;
                $scope.commande.totalttc = totalttc;
            } else {
                $scope.commande.totalallht = 0;
                $scope.commande.totalalltva = 0;
                $scope.commande.totalttc = 0;
            }
        }
        calculer();
        $scope.calculer = function () {
            calculer();
        };


        $scope.val = 15;
        var updateModel = function (val) {
            $scope.$apply(function () {
                $scope.val = val;
            });
        };
        angular.element("#slider").on('slideStop', function (data) {
            updateModel(data.value);
        });

        $scope.addelements = function () {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'monTemplate.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'data',
                    function ($scope, $modalInstance, scopeParent, data) {
                        $scope.currency = scopeParent.currency;
                        $scope.ListeArticles = data;
                        $scope.collectArt = function () {
                            angular.forEach(data, function (article) {
                                if (article.isChecked) {
                                    scopeParent.commande.ListeElements.push(article);
                                    article.qte = parseInt(article.qte);
                                    article.qteTmp = parseInt(article.qte);
                                    article.isChecked = false;
                                    article.isAdded = true;
                                    calculer();
                                }
                            });

                            $modalInstance.close();
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
                    data: function () {
                        return $scope.ListeArticles;
                    }
                }
            });
        };

        $scope.removeElement = function (id) {
            if ($scope.commande.ListeElements.length > 0) {
                angular.forEach($scope.commande.ListeElements, function (artComm, position) {
                    if (artComm.idArticle === id) {
                        $scope.commande.ListeElements.splice(position, 1);
                        calculer();
                    }
                });
                angular.forEach($scope.ListeArticles, function (article) {
                    if (article.idArticle === id) {
                        article.isAdded = false;
                    }
                });
            } else {
                return false;
            }
        };

        $scope.apercuPDF = function () {
            var popup = $window.open('', '_blank');
            popup.document.write("Chargement...");
            ServiceUtiles.getSociete($scope.app.user.idSociete).then(function (societe) {
                ServiceUtiles.getParamsPdf(societe.idSociete).then(function (paramsPdf) {
                    $scope.societe = societe;
                    $scope.paramsPdf = paramsPdf;
                    var data = [
                        {client: []},
                        {commande: []},
                        {societe: []},
                        {paramsPdf: []},
                        {currency: []},
                        {rootDir: []}
                    ];

                    data[0].client.push($scope.client);
                    data[1].commande.push($scope.commande);
                    data[2].societe.push($scope.societe);
                    data[3].paramsPdf.push($scope.paramsPdf);
                    data[4].currency.push($scope.currency);
                    data[5].rootDir.push(rootDir);

                    ServiceCommande.generatePDFCommandeVente(data).then(function (href) {
                        popup.location = href;
                    });
                });
            });
        };

        $scope.saveCommandeVente = function (commande) {
            ServiceCommande.countCommande(idSociete).then(function (data) {
                if (data.countCommande >= myAbonnement.maxCommandesCount && commande.Oper === 1) {
                    notifyBox("Erreur", "Vous avez atteint la limite de " + myAbonnement.maxCommandesCount + " fiches commandes.\n Abonnez vous pour enlever cette limite.", 'warning');
                } else {
                    var msg = checkData(commande);

                    if (msg !== '') {
                        notifyBox('Erreur', msg, 'error');
                    } else {
                        $scope.commande.idSociete = idSociete;
                        $scope.commande.dateCre = $filter("date")(new Date($scope.commande.dateCre), 'yyyy-MM-dd hh:mm:ss');
                        ServiceCommande.saveCommandeVente(commande).then(function () {
                            if ($scope.article.Oper === 1) {
                                interactHisto(commande.reference, 'commandeVente', 46, '');
                            } else {
                                interactHisto(commande.reference, 'commandeVente', 47, '');
                            }
                            notifyBox('Succès', 'Edition Commande Vente: ' + commande.reference + ' effectué avec succès', 'success');
                            $timeout(function () {
                                viderChampsCommande();
                                $state.go('app.commandeVente');
                            }, 800);

                        });
                    }
                }
            });


        };

    }]);