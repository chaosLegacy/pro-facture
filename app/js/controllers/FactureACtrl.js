'use strict';

/* Controllers */
// factureAchat controller
app.controller('FactureAController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceFacture', 'ServiceFournisseurs', 'ServiceCommande', '$state', '$timeout', '$localStorage', 'toaster', function ($scope, ServiceUtiles, ServiceHistorique, ServiceFacture, ServiceFournisseurs, ServiceCommande, $state, $timeout, $localStorage, toaster) {
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
        ServiceUtiles.getListEtats().then(function(data){
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
        // Charger la liste des factures d'achats
        ServiceFacture.getListeFactureAchat(idSociete).then(function (data) {
            if (typeof data === 'object') {
                $scope.ListeFactureAchat = data;
                
                $scope.totalItems = data.length;

            } else {
                $scope.ListeFactureAchat = [];
            }
        });

        $scope.currentPage = 1;
        $scope.maxSize = 5;

        // trier les facture croissant décroissant 
        $scope.sort = [
            {label: 'reference'},
            {label: 'date'},
            {label: 'total'}
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
            angular.forEach($scope.ListeEtats, function(etat){
                if(etat.idEtat === status) {
                    statusLabel = etat.label;
                }
            });
            return statusLabel;
        };

        // Actions factureAchat
        $scope.selectedAction = function (action, idFacture) {
            switch (action) {
                case 'updateFactureAchat':
                    $scope.updateFactureAchat(idFacture);
                    break;
                case 'deleteFactureAchat':
                    $scope.deleteFactureAchat(idFacture);
                    break;
            }
        };
        $scope.addFactureAchat = function () {
            ServiceFacture.countFacture(idSociete).then(function (data) {
                if(data.countFacture >= myAbonnement.maxFacturesCount) {
                    notifyBox("Erreur", "Vous avez atteint la limite de "+ myAbonnement.maxFacturesCount + " fiches factures.\n Abonnez vous pour enlever cette limite.",'warning');
                } else {
                    $state.go('app.gesFactureAchat');
                }
            });
        };

        $scope.updateFactureAchat = function (idFacture) {
            $state.go('app.gesFactureAchat', {idFact: idFacture});
        };

        $scope.deleteFactureAchat = function (idFacture) {
            ServiceFacture.deleteFactureAchat(idFacture).then(function () {
                angular.forEach($scope.ListeFactureAchat, function (facture, index) {
                    if (facture.idFactAchat === idFacture) {
                        $scope.ListeFactureAchat.splice(index, 1);
                        interactHisto(facture.reference, 'factureAchat', 34, '');
                        notifyBox('Succès', 'Supression Article: ' + facture.reference + ' effectué avec succès', 'success');
                    }
                });
            });
        };

    }]);