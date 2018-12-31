'use strict';

/* Controllers */
// BonLivraisonVente controller
app.controller('BonLivraisonVController', ['$scope', 'ServiceUtiles', 'ServiceBonLivraison', 'ServiceClients', 'ServiceCommande', '$state', '$timeout', '$localStorage', 'toaster', function ($scope, ServiceUtiles, ServiceBonLivraison, ServiceClients, ServiceCommande, $state, $timeout, $localStorage, toaster) {
        var idSociete = $scope.app.user.idSociete;
        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        }
        // Charger la liste des BonLivraison de vente
        ServiceBonLivraison.getListeBonLivraisonVente(idSociete).then(function (data) {
            if (typeof data === 'object') {
                $scope.ListeBonLivraisonVente = data;
                
                $scope.totalItems = data.length;

            } else {
                $scope.ListeBonLivraisonVente = [];
            }
        });

        $scope.currentPage = 1;
        $scope.maxSize = 5;

        // trier les bon de livraison croissant décroissant 
        $scope.sort = [
            {label: 'reference'},
            {label: 'date'}
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

        // Actions bonLivraisonAchat
        $scope.selectedAction = function (action, idBonLivraison) {
            switch (action) {
                case 'updateBonLivraisonVente':
                    $scope.updateBonLivraisonVente(idBonLivraison);
                    break;
            }
        };
        $scope.addBonLivraisonVente = function () {
            $state.go('app.gesBonLivraisonVente');
        };

        $scope.updateBonLivraisonVente = function (idBonLivraison) {
            $state.go('app.gesBonLivraisonVente', {idBL: idBonLivraison});
        };

    }]);