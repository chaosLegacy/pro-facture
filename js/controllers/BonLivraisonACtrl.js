'use strict';

/* Controllers */
// factureAchat controller
app.controller('BonLivraisonAController', ['$scope', 'ServiceUtiles', 'ServiceBonLivraison', 'ServiceFournisseurs', 'ServiceCommande', '$state', '$timeout', '$localStorage', 'toaster', function ($scope, ServiceUtiles, ServiceBonLivraison, ServiceFournisseurs, ServiceCommande, $state, $timeout, $localStorage, toaster) {
        var idSociete = $scope.app.user.idSociete;
        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        }
        // Charger la liste des factures d'achats
        ServiceBonLivraison.getListeBonLivraisonAchat(idSociete).then(function (data) {
            if (typeof data === 'object') {
                $scope.ListeBonLivraisonAchat = data;
                
                $scope.totalItems = data.length;

            } else {
                $scope.ListeBonLivraisonAchat = [];
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
                case 'updateBonLivraisonAchat':
                    $scope.updateBonLivraisonAchat(idBonLivraison);
                    break;
            }
        };
        $scope.addBonLivraisonAchat = function () {
            $state.go('app.gesBonLivraisonAchat');
        };

        $scope.updateBonLivraisonAchat = function (idBonLivraison) {
            $state.go('app.gesBonLivraisonAchat', {idBL: idBonLivraison});
        };

    }]);