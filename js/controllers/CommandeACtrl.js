'use strict';

/* Controllers */
// commandeAchat controller
app.controller('CommandeAController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceFournisseurs', 'ServiceCommande', '$state', '$timeout', '$localStorage', 'toaster', function ($scope, ServiceUtiles, ServiceHistorique, ServiceFournisseurs, ServiceCommande, $state, $timeout, $localStorage, toaster) {
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
        ServiceUtiles.getListEtats().then(function (data) {
            $scope.ListeEtats = data;
        });

        // Charger la liste des commandes d'achats
        ServiceCommande.getListeCommandeAchat(idSociete).then(function (data) {
            if (typeof data === 'object') {
                ServiceFournisseurs.getListeFouenisseurs(idSociete).then(function (allFour) {
                    $scope.ListeCommandeAchat = data;
                    $scope.ListeFournisseurs = allFour;
                    angular.forEach($scope.ListeCommandeAchat, function (commande) {
                        angular.forEach($scope.ListeFournisseurs, function (fournisseur) {
                            if (commande.idFournisseur === fournisseur.idFournisseur) {
                                commande.fournisseur = fournisseur.nom;
                            }
                        });
                    });
                    $scope.totalItems = data.length;
                });
            } else {
                $scope.ListeCommandeAchat = [];
            }
        });

        $scope.currentPage = 1;
        $scope.maxSize = 5;

        // trier les commande croissant décroissant 
        $scope.sort = [
            {label: 'reference'},
            {label: 'date'},
            {label: 'total'},
            {label: 'fournisseur'}
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

        // Actions commandeAchat
        $scope.selectedAction = function (action, idCommande) {
            switch (action) {
                case 'updateCommandeAchat':
                    $scope.updateCommandeAchat(idCommande);
                    break;
                case 'deleteCommandeAchat':
                    $scope.deleteCommandeAchat(idCommande);
                    break;
            }
        };
        $scope.addCommandeAchat = function () {
            ServiceCommande.countCommande(idSociete).then(function (data) {
                if(data.countCommande >= myAbonnement.maxCommandesCount) {
                    notifyBox("Erreur", "Vous avez atteint la limite de "+ myAbonnement.maxCommandesCount + " fiches commandes.\n Abonnez vous pour enlever cette limite.",'warning');
                } else {
                    $state.go('app.gesCommandeAchat');
                }
            });
        };

        $scope.updateCommandeAchat = function (idCommande) {
            $state.go('app.gesCommandeAchat', {idComm: idCommande});
        };

        $scope.deleteCommandeAchat = function (idCommande) {
            ServiceCommande.deleteCommandeAchat(idCommande).then(function (response) {
                if (response.status === 'Failed') {
                    notifyBox('Erreur', response.msg, 'error');
                } else {
                    angular.forEach($scope.ListeCommandeAchat, function (commande, index) {
                        if (commande.idCommAchat === idCommande) {
                            $scope.ListeCommandeAchat.splice(index, 1);
                            interactHisto(commande.reference, 'commandeAchat', 23, '');
                            notifyBox('Succès', 'Supression commande achat: ' + commande.reference + ' effectué avec succès', 'success');
                        }
                    });
                }
            });
        };

    }]);