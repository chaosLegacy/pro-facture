'use strict';

/* Services */
// clients service
angular.module('ServicePaiements', [])
        .service("ServicePaiements", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = $localStorage.user.api+'/Paiement/';

                this.getListePaiements = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllPaiements',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data[0]);
                        console.log(response);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                        console.log(response);
                    });
                    return deferred.promise;
                };

                this.savePaiement = function (paiement) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url + 'InsertPaiement',
                        timeout: 15000,
                        data: $.param({'data': paiement}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });

                    return deferred.promise;
                };

                this.deletePaiement = function (idPaiement) {
                    var deferred = $q.defer();
                    var data = {
                        idPaiement: idPaiement
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeletePaiement',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                        console.log(response);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                        console.log(response);
                    });
                    return deferred.promise;
                };

            }]);