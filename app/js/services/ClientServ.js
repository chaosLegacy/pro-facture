'use strict';

/* Services */
// clients service
angular.module('ServiceClients', [])
        .service("ServiceClients", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = $localStorage.user.api+'/Client/';
        
                this.countClient = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'CountClient',
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
                
                this.getListeClients = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllClients',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                        console.log(response);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getClient = function (idCli) {
                    var deferred = $q.defer();
                    var data = {
                        idClient: idCli
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

                this.deleteClient = function (idCli) {
                    var deferred = $q.defer();
                    var data = {
                        idClient: idCli
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
                        deferred.resolve(response.data);
                        console.log(response);
                    });
                    return deferred.promise;
                };
            }]);