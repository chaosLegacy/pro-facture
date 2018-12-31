'use strict';

/* Services */
// clients service
angular.module('ServiceArticles', [])
        .service("ServiceArticles", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = $localStorage.user.api+'/Article/';
                this.getListeStock = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetStock',
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

                this.saveStock = function (stock) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url + 'InsertStock',
                        timeout: 15000,
                        data: $.param({'data': stock}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });

                    return deferred.promise;
                };
                
                this.deleteStock = function (idStock) {
                    var deferred = $q.defer();
                    var data = {
                        idStock: idStock
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeleteStock',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getListeArticles = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllArticles',
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

                this.getArticle = function (idArt) {
                    var deferred = $q.defer();
                    var data = {
                        idArticle: idArt
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetArticle',
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

                this.saveArticle = function (article) {
                    var deferred = $q.defer();

                    if (article.Oper === 1) {
                        $http({
                            method: 'POST',
                            url: url + 'InsertArticle',
                            timeout: 15000,
                            data: $.param({'data': article}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            deferred.resolve(response.data);
                        }, function errorCallback(response) {
                            deferred.resolve(response.statusText);
                        });
                    } else {
                        $http({
                            method: 'POST',
                            url: url + 'UpdateArticle',
                            timeout: 15000,
                            data: $.param({'data': article}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            deferred.resolve(response.data);
                        }, function errorCallback(response) {
                            deferred.resolve(response.statusText);
                        });
                    }
                    return deferred.promise;
                };

                this.deleteArticle = function (idArt) {
                    var deferred = $q.defer();
                    var data = {
                        idArticle: idArt
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeleteArticle',
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