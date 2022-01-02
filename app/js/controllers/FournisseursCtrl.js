'use strict';

/* Controllers */
// fournisseurs controller
app.controller('FournisseursController', ['$scope', 'ServiceFournisseurs', 'ServiceHistorique', '$state', '$timeout', 'toaster', function ($scope, ServiceFournisseurs, ServiceHistorique, $state, $timeout, toaster) {
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
        // Charger la liste des fournisseurs
        ServiceFournisseurs.getListeFouenisseurs(idSociete).then(function (data) {
            if (typeof data !== 'undefined') {
                $scope.ListeFournisseurs = data;
            } else {
                $scope.ListeFournisseurs = [];
            }
        });

        // trier les clients croissant décroissant 
        $scope.sort = [
            {label: 'nom'},
            {label: 'reference'},
            {label: 'ville'}
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

        // Actions fournisseurs
        $scope.selectedAction = function (action, idFournisseur) {
            switch (action) {
                case 'selectFournisseur':
                    $scope.selectFournisseur(idFournisseur);
                    break;
                case 'updateFournisseur':
                    $scope.updateFournisseur(idFournisseur);
                    break;
                case 'deleteFournisseur':
                    $scope.deleteFournisseur(idFournisseur);
                    break;
            }
        };
        // action call addFournisseur
        $scope.addFournisseur = function () {
            ServiceFournisseurs.countFournisseur(idSociete).then(function (data) {
                if(data.countFournisseur >= myAbonnement.maxFournisseursCount) {
                    notifyBox("Erreur", "Vous avez atteint la limite de "+ myAbonnement.maxFournisseursCount + " fiches fournisseurs.\n Abonnez vous pour enlever cette limite.",'warning');
                } else {
                    $state.go('app.gesFournisseur');
                }
            });
        };

        $scope.selectFournisseur = function (idFournisseur) {
            $state.go('app.ficheFournisseur', {idFour: idFournisseur});
        };

        $scope.updateFournisseur = function (idFournisseur) {
            $state.go('app.gesFournisseur', {idFour: idFournisseur});
        };

        $scope.deleteFournisseur = function (idFournisseur) {
            ServiceFournisseurs.deleteFournisseur(idFournisseur).then(function (response) {
                if (response.status === 'Failed') {
                    notifyBox('Erreur', response.msg, 'error');
                } else {
                    angular.forEach($scope.ListeFournisseurs, function (fournisseur, index) {
                        if (fournisseur.idFournisseur === idFournisseur) {
                            $scope.ListeFournisseurs.splice(index, 1);
                            interactHisto(fournisseur.nom, 'fournisseur', 8, '');
                            notifyBox('Succès', 'Supression Fournisseur: ' + fournisseur.reference + ' effectué avec succès', 'success');
                        }
                    });
                }
            });
        };

    }]);