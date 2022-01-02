'use strict';

/* Services */
// facture service
angular.module('ServiceBonLivraison', [])
        .service("ServiceBonLivraison", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = $localStorage.user.api+'/BonLivraison/';

                //=======================
                //---- Module d'achat
                //=======================
                
                this.getListeBonLivraisonAchat = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllBonLivraisonAchat',
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

                this.getBonLivraisonAchat = function (idBL) {
                    var deferred = $q.defer();
                    var data = {
                        idBonLivraison: idBL
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetBonLivraisonAchat',
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

                this.saveBonLivraisonAchat = function (bonLivraison) {
                    var deferred = $q.defer();
                    if (bonLivraison.Oper === 1) {
                        $http({
                            method: 'POST',
                            url: url + 'InsertBonLivraisonAchat',
                            timeout: 15000,
                            data: $.param({'data': bonLivraison}),
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
                            url: url + 'UpdateBonLivraisonAchat',
                            timeout: 15000,
                            data: $.param({'data': bonLivraison}),
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
                
                
                //=======================
                //---- Module de vente
                //=======================
                
                this.getListeBonLivraisonVente = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllBonLivraisonVente',
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

                this.getBonLivraisonVente = function (idBL) {
                    var deferred = $q.defer();
                    var data = {
                        idBonLivraison: idBL
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetBonLivraisonVente',
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

                this.saveBonLivraisonVente = function (bonLivraison) {
                    var deferred = $q.defer();

                    if (bonLivraison.Oper === 1) {
                        $http({
                            method: 'POST',
                            url: url + 'InsertBonLivraisonVente',
                            timeout: 15000,
                            data: $.param({'data': bonLivraison}),
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
                            url: url + 'UpdateBonLivraisonVente',
                            timeout: 15000,
                            data: $.param({'data': bonLivraison}),
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

            }]);