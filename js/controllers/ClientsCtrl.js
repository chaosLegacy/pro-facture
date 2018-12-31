'use strict';

/* Controllers */
// clients controller
app.controller('ClientsController', ['$scope', 'ServiceClients', 'ServiceHistorique', '$state', '$timeout', '$localStorage', 'toaster', function ($scope, ServiceClients, ServiceHistorique, $state, $timeout, $localStorage, toaster) {
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
        
        // Charger la liste des clients
        ServiceClients.getListeClients(idSociete).then(function (data) {
            if (typeof data !== 'undefined') {
                $scope.ListeClients = data;
            } else {
                $scope.ListeClients = [];
            }

        });

        // trier les articles croissant décroissant 
        $scope.sort = [
            {label: 'nom'},
            {label: 'reference'},
            {label: 'villeF'}
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

        // Actions clients
        $scope.selectedAction = function (action, idClient) {
            switch (action) {
                case 'selectClient':
                    $scope.selectClient(idClient);
                    break;
                case 'updateClient':
                    $scope.updateClient(idClient);
                    break;
                case 'deleteClient':
                    $scope.deleteClient(idClient);
                    break;
            }
        };
        // action call addClient
        $scope.addClient = function () {
            ServiceClients.countClient(idSociete).then(function (data) {
                if(data.countClient >= myAbonnement.maxClientsCount) {
                    notifyBox("Erreur", "Vous avez atteint la limite de "+ myAbonnement.maxClientsCount + " fiches clients.\n Abonnez vous pour enlever cette limite.",'warning');
                } else {
                    $state.go('app.gesClient');
                }
            });
        };

        $scope.selectClient = function (idClient) {
            $state.go('app.ficheClient', {idCli: idClient});
        };

        $scope.updateClient = function (idClient) {
            $state.go('app.gesClient', {idCli: idClient});
        };

        $scope.deleteClient = function (idClient) {
            ServiceClients.deleteClient(idClient).then(function (response) {
                if (response.status === 'Failed') {
                    notifyBox('Erreur', response.msg, 'error');
                } else {
                    angular.forEach($scope.ListeClients, function (client, index) {
                        if (client.idClient === idClient) {
                            $scope.ListeClients.splice(index, 1);
                            interactHisto(client.nom, 'client', 2, '');
                            notifyBox('Succès', 'Supression Client: ' + client.reference + ' effectué avec succès', 'success');
                        }
                    });
                }

            });
        };

    }]);