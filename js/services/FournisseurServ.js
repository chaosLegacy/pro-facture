'use strict';

/* Services */
// clients service
angular.module('ServiceFournisseurs', [])
        .service("ServiceFournisseurs", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = 'http://localhost/PFE/pro-facture/api/Fournisseur/';

                this.getListeFouenisseurs = function () {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: url + 'GetAllFournisseurs',
                        timeout: 15000,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data[0]);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getFournisseur = function (refFour) {
                    var deferred = $q.defer();
                    var data = {
                        reference: refFour
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetFournisseur',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.saveFournisseur = function (fournisseur) {
                    var deferred = $q.defer();
                    
                    if (fournisseur.Oper === 1) {
                        fournisseur.idFournisseur = $localStorage.idUser + (Date.now() + "").substring(4, 15);
                        
                        $http({
                            method: 'POST',
                            url: url + 'InsertFournisseur',
                            timeout: 15000,
                            data: $.param({'data': fournisseur}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            console.log(response);
                            deferred.resolve(response);
                        }, function errorCallback(response) {
                            console.log(response);
                            deferred.resolve(response.statusText);
                        });
                    } else {
                        fournisseur.idUser = $localStorage.idUser;
                        $http({
                            method: 'POST',
                            url: url + 'UpdateFournisseur',
                            timeout: 15000,
                            data: $.param({'data': fournisseur}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {debugger;
                            var object = angular.fromJson(response.data);
                            console.log(object);
                            deferred.resolve(object);
                        }, function errorCallback(response) {debugger;
                            console.log(response);
                            deferred.resolve(response.statusText);
                        });
                    }
                    return deferred.promise;
                };
                
                this.deleteFournisseur = function (refFour) {
                    var deferred = $q.defer();
                    var data = {
                        reference: refFour
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeleteFournisseur',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response);
                        console.log(response);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                        console.log(response);
                    });
                    return deferred.promise;
                };

            }]);