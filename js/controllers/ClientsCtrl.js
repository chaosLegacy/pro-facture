'use strict';

/* Controllers */
// clients controller
app.controller('ClientsController', ['$scope', 'ServiceClients', '$state', '$timeout', '$localStorage', function ($scope, ServiceClients, $state, $timeout, $localStorage) {
        // Charger la liste des clients
        ServiceClients.getListeClients().then(function (data) {
            $scope.ListeClients = data;
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

        // Actions clients
        $scope.selectedAction = function (action, reference) {
            switch (action) {
                case 'selectClient':
                    $scope.selectClient(reference);
                    break;
                case 'updateClient':
                    $scope.updateClient(reference);
                    break;
                case 'deleteClient':
                    $scope.deleteClient(reference);
                    break;
            }
        };
        // action call addClient
        $scope.addClient = function () {
            $state.go('app.gesClient');
        };

        $scope.selectClient = function (reference) {
            $state.go('app.ficheClient', {refCli: reference});
        };

        $scope.updateClient = function (reference) {
            $state.go('app.gesClient', {refCli: reference});
        };

        $scope.deleteClient = function (reference) {
            ServiceClients.deleteClient(reference).then(function () {
                angular.forEach($scope.ListeClients, function(client, index){
                   if(client.reference === reference) {
                       $scope.ListeClients.splice(index, 1);
                   } 
                });
            });
        };

    }]);