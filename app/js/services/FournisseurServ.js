'use strict';

/* Services */
// clients service
angular.module('ServiceFournisseurs', [])
        .service("ServiceFournisseurs", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = $localStorage.user.api+'/Fournisseur/';
                
                this.countFournisseur = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'CountFournisseur',
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
                
                this.getListeFouenisseurs = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllFournisseurs',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data[0]);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getFournisseur = function (idFour) {
                    var deferred = $q.defer();
                    var data = {
                        idFournisseur: idFour
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
                        $http({
                            method: 'POST',
                            url: url + 'UpdateFournisseur',
                            timeout: 15000,
                            data: $.param({'data': fournisseur}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            deferred.resolve(response.data);
                        }, function errorCallback(response) {
                            deferred.resolve(response.statusText);
                        });
                    }
                    return deferred.promise;
                };
                
                this.deleteFournisseur = function (idFour) {
                    var deferred = $q.defer();
                    var data = {
                        idFournisseur: idFour
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeleteFournisseur',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response);
                    }, function errorCallback(response) {
                        deferred.resolve(response.data);
                    });
                    return deferred.promise;
                };

            }]);