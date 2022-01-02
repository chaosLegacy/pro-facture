'use strict';

/* Services */
// facture service
angular.module('ServiceFacture', [])
    .service("ServiceFacture", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
        var url = $localStorage.user.api + '/Facture/';

        this.countFacture = function (idSoc) {
            var deferred = $q.defer();
            var data = {
                idSociete: idSoc
            };
            $http({
                method: 'POST',
                url: url + 'CountFacture',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        //=======================
        //---- Module d'achat
        //=======================

        this.getListeFactureAchat = function (idSoc) {
            var deferred = $q.defer();
            var data = {
                idSociete: idSoc
            };
            $http({
                method: 'POST',
                url: url + 'GetAllFactureAchat',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data[0]);
                console.log(response);
            }, function errorCallback(response) {
                deferred.resolve(response.statusText);
                console.log(response);
            });
            return deferred.promise;
        };

        this.getFactureAchat = function (idFact) {
            var deferred = $q.defer();
            var data = {
                idFacture: idFact
            };
            $http({
                method: 'POST',
                url: url + 'GetFactureAchat',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        this.saveFactureAchat = function (facture) {
            var deferred = $q.defer();

            if (facture.Oper === 1) {
                $http({
                    method: 'POST',
                    url: url + 'InsertFactureAchat',
                    timeout: 15000,
                    data: $.param({ 'data': facture }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {

                    console.log(response);
                    deferred.resolve(response.data);
                }, function errorCallback(response) {

                    console.log(response);
                    deferred.resolve(response.statusText);
                });
            } else {
                $http({
                    method: 'POST',
                    url: url + 'UpdateFactureAchat',
                    timeout: 15000,
                    data: $.param({ 'data': facture }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {
                    console.log(response);
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    console.log(response);
                    deferred.resolve(response.statusText);
                });
            }
            return deferred.promise;
        };

        this.deleteFactureAchat = function (idComm) {
            var deferred = $q.defer();
            var data = {
                idCommande: idComm
            };
            $http({
                method: 'POST',
                url: url + 'DeleteFactureAchat',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {

                deferred.resolve(response.data);
            }, function errorCallback(response) {

                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        this.getImpyedFactureAchat = function (idSoc) {
            var deferred = $q.defer();
            var data = {
                idSociete: idSoc
            };
            $http({
                method: 'POST',
                url: url + 'GetImpyedFactureAchat',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        this.updateFactureAchatStatus = function (facture) {
            var deferred = $q.defer();
            var data = {
                idFacture: facture.idFacture,
                idEtat: facture.idEtat
            };
            $http({
                method: 'POST',
                url: url + 'UpdateFactureAchatStatus',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {

                deferred.resolve(response.data);
            }, function errorCallback(response) {

                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        //=======================
        //---- Module de vente
        //=======================

        this.getListeFactureVente = function (idSoc) {
            var deferred = $q.defer();
            var data = {
                idSociete: idSoc
            };
            $http({
                method: 'POST',
                url: url + 'GetAllFactureVente',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data[0]);
                console.log(response);
            }, function errorCallback(response) {
                deferred.resolve(response.statusText);
                console.log(response);
            });
            return deferred.promise;
        };

        this.getFactureVente = function (idFact) {
            var deferred = $q.defer();
            var data = {
                idFacture: idFact
            };
            $http({
                method: 'POST',
                url: url + 'GetFactureVente',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        this.saveFactureVente = function (facture) {
            var deferred = $q.defer();

            if (facture.Oper === 1) {
                $http({
                    method: 'POST',
                    url: url + 'InsertFactureVente',
                    timeout: 15000,
                    data: $.param({ 'data': facture }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {

                    console.log(response);
                    deferred.resolve(response.data);
                }, function errorCallback(response) {

                    console.log(response);
                    deferred.resolve(response.statusText);
                });
            } else {
                $http({
                    method: 'POST',
                    url: url + 'UpdateFactureVente',
                    timeout: 15000,
                    data: $.param({ 'data': facture }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {
                    console.log(response);
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    console.log(response);
                    deferred.resolve(response.statusText);
                });
            }
            return deferred.promise;
        };

        this.deleteFactureVente = function (idComm) {
            var deferred = $q.defer();
            var data = {
                idCommande: idComm
            };
            $http({
                method: 'POST',
                url: url + 'DeleteFactureVente',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {

                deferred.resolve(response.data);
            }, function errorCallback(response) {

                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        this.generatePDFFactureVente = function (facture) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'js/services/pdf/pdfFactureVente.php',
                timeout: 15000,
                data: $.param({ 'data': facture }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        this.getImpyedFactureVente = function (idSoc) {
            var deferred = $q.defer();
            var data = {
                idSociete: idSoc
            };
            $http({
                method: 'POST',
                url: url + 'GetImpyedFactureVente',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

        this.updateFactureVenteStatus = function (facture) {
            var deferred = $q.defer();
            var data = {
                idFacture: facture.idFacture,
                idEtat: facture.idEtat
            };
            $http({
                method: 'POST',
                url: url + 'UpdateFactureVenteStatus',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {

                deferred.resolve(response.data);
            }, function errorCallback(response) {

                deferred.resolve(response.statusText);
            });
            return deferred.promise;
        };

    }]);