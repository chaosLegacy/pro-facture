'use strict';

/* Services */
// clients hstorique
angular.module('ServiceHistorique', [])
        .service("ServiceHistorique", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = $localStorage.user.api+'/Historique/';

                this.getListeHistorique = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllHistorique',
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

                this.getAllNoneSeenHistorique = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllNoneSeenHistorique',
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
                
                this.saveHistorique = function (historique) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url + 'Insertistorique',
                        timeout: 15000,
                        data: $.param({'data': historique}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });

                    return deferred.promise;
                };
                
                this.updateViewedHistorique = function (idHistorique) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url + 'UpdateViewedHistorique',
                        timeout: 15000,
                        data: $.param({'data': idHistorique}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });

                    return deferred.promise;
                };
                
                this.updateAllHistoriqueToViewed = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'UpdateAllHistoriqueToViewed',
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
                
                
            }]);