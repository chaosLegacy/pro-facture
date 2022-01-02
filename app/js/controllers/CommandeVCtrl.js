'use strict';

/* Controllers */
// commandeVente controller
app.controller('CommandeVController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceClients', 'ServiceCommande', '$state', '$timeout', '$localStorage', 'toaster', function ($scope, ServiceUtiles, ServiceHistorique, ServiceClients, ServiceCommande, $state, $timeout, $localStorage, toaster) {
        var idSociete = $scope.app.user.idSociete;
        var typeAbonement = $scope.app.user.typeAbonnement;
        var myAbonnement = abonnementChecker(typeAbonement);
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
        // Charger la liste des commandes de vente
        ServiceCommande.getListeCommandeVente(idSociete).then(function (data) {
            if (typeof data === 'object') {
                ServiceClients.getListeClients(idSociete).then(function (allCl) {
                    $scope.ListeCommandeVente = data;
                    $scope.ListeClients = allCl;
                    angular.forEach($scope.ListeCommandeVente, function (commande) {
                        angular.forEach($scope.ListeClients, function (client) {
                            if (commande.idClient === client.idClient) {
                                commande.client = client.nom;
                            }
                        });
                    });
                    $scope.totalItems = data.length;
                });
            } else {
                $scope.ListeCommandeVente = [];
            }
        });

        $scope.currentPage = 1;
        $scope.maxSize = 5;

        // trier les commande croissant décroissant 
        $scope.sort = [
            {label: 'reference'},
            {label: 'date'},
            {label: 'total'},
            {label: 'client'}
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

        $scope.myStatue = function (status) {
            var statusLabel = "";
            angular.forEach($scope.ListeEtats, function (etat) {
                if (etat.idEtat === status) {
                    statusLabel = etat.label;
                }
            });
            return statusLabel;
        };

        // Actions commandeVente
        $scope.selectedAction = function (action, idCommande) {
            switch (action) {
                case 'updateCommandeVente':
                    $scope.updateCommandeVente(idCommande);
                    break;
                case 'deleteCommandeVente':
                    $scope.deleteCommandeVente(idCommande);
                    break;
            }
        };
        $scope.addCommandeVente = function () {
            ServiceCommande.countCommande(idSociete).then(function (data) {
                if(data.countCommande >= myAbonnement.maxCommandesCount) {
                    notifyBox("Erreur", "Vous avez atteint la limite de "+ myAbonnement.maxCommandesCount + " fiches commandes.\n Abonnez vous pour enlever cette limite.",'warning');
                } else {
                    $state.go('app.gesCommandeVente');
                }
            });
        };

        $scope.updateCommandeVente = function (idCommande) {
            $state.go('app.gesCommandeVente', {idComm: idCommande});
        };

        $scope.deleteCommandeVente = function (idCommande) {
            ServiceCommande.deleteCommandeVente(idCommande).then(function (response) {
                if (response.status === 'Failed') {
                    notifyBox('Erreur', response.msg, 'error');
                } else {
                    angular.forEach($scope.ListeCommandeVente, function (commande, index) {
                        if (commande.idCommVente === idCommande) {
                            $scope.ListeCommandeVente.splice(index, 1);
                            interactHisto(commande.reference, 'commandeVente', 48, '');
                            notifyBox('Succès', 'Supression commande vente: ' + commande.reference + ' effectué avec succès', 'success');
                        }
                    });
                }

            });
        };

    }]);