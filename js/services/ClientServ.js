'use strict';

/* Services */
// clients service
angular.module('ServiceClients', [])
        .service("ServiceClients", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = 'http://localhost/PFE/pro-facture/api/Client/';

                this.getListeClients = function () {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: url + 'GetAllClients',
                        timeout: 15000,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        //var object = angular.fromJson(response.data);
                        deferred.resolve(response.data[0]);
                        console.log(response);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                        console.log(response);
                    });
                    return deferred.promise;
                };

                this.getClient = function (refCli) {
                    var deferred = $q.defer();
                    var data = {
                        reference: refCli
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetClient',
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

                this.saveClient = function (client) {
                    var deferred = $q.defer();
                    
                    if (client.Oper === 1) {
                        client.idClient = $localStorage.idUser + (Date.now() + "").substring(4, 15);
                        
                        $http({
                            method: 'POST',
                            url: url + 'InsertClient',
                            timeout: 15000,
                            data: $.param({'data': client}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            console.log(response);
                            deferred.resolve(response.data);
                        }, function errorCallback(response) {
                            console.log(response);
                            deferred.resolve(response.statusText);
                        });
                    } else {
                        client.idUser = $localStorage.idUser;
                        $http({
                            method: 'POST',
                            url: url + 'UpdateClient',
                            timeout: 15000,
                            data: $.param({'data': client}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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

                this.deleteClient = function (refCli) {
                    var deferred = $q.defer();
                    var data = {
                        reference: refCli
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeleteClient',
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