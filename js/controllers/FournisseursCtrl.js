'use strict';

/* Controllers */
// fournisseurs controller
app.controller('FournisseursController', ['$scope', 'ServiceFournisseurs', '$state', '$timeout', '$localStorage', function ($scope, ServiceFournisseurs, $state, $timeout, $localStorage) {
        // Charger la liste des fournisseurs
        ServiceFournisseurs.getListeFouenisseurs().then(function (data) {
            $scope.ListeFournisseurs = data;
        });
        // trier les clients croissant décroissant 
        $scope.sort = [
            {label: 'nom'},
            {label: 'reference'},
            {label: 'facture'},
            {label: 'solde'}
        ];
        $scope.reverse = false;
        $scope.orderBy = function (value) {
            angular.forEach($scope.sort, function (data) {
                if (data.label == value) {
                    $scope.reverse = !$scope.reverse;
                    return;
                }
            });
            $scope.sort.label = value;
        };

        // Actions fournisseurs
        $scope.selectedAction = function (action, reference) {
            switch (action) {
                case 'selectFournisseur':
                    $scope.selectFournisseur(reference);
                    break;
                case 'updateFournisseur':
                    $scope.updateFournisseur(reference);
                    break;
                case 'deleteFournisseur':
                    $scope.deleteFournisseur(reference);
                    break;
            }
        };
        // action call addFournisseur
        $scope.addFournisseur = function () {
            $state.go('app.gesFournisseur');
        };

        $scope.selectFournisseur = function (reference) {
            $state.go('app.ficheFournisseur', {refFour: reference});
        };

        $scope.updateFournisseur = function (reference) {
            $state.go('app.gesFournisseur', {refFour: reference});
        };

        $scope.deleteFournisseur = function (reference) {
            ServiceFournisseurs.deleteFournisseur(reference).then(function () {
                angular.forEach($scope.ListeFournisseurs, function (fournisseur, index) {
                    if (fournisseur.reference === reference) {
                        $scope.ListeFournisseurs.splice(index, 1);
                    }
                });
            });
        };

    }]);