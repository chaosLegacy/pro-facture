'use strict';

/* Controllers */
// factureVente controller
app.controller('FactureVController', ['$scope', 'ServiceUtiles', 'ServiceFacture', '$state', 'toaster', function ($scope, ServiceUtiles, ServiceFacture, $state, toaster) {
        var idSociete = $scope.app.user.idSociete;
        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
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
        // Charger la liste des factures vente
        ServiceFacture.getListeFactureVente(idSociete).then(function (data) {
            if (typeof data === 'object') {
                $scope.ListeFactureVente = data;
                
                $scope.totalItems = data.length;

            } else {
                $scope.ListeFactureVente = [];
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

        // Actions factureVente
        $scope.selectedAction = function (action, idFacture) {
            switch (action) {
                case 'updateFactureVente':
                    $scope.updateFactureVente(idFacture);
                    break;
            }
        };
        $scope.addFactureVente = function () {
            $state.go('app.gesFactureVente');
        };

        $scope.updateFactureVente = function (idFacture) {
            $state.go('app.gesFactureVente', {idFact: idFacture});
        };


    }]);