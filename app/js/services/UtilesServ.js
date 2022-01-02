'use strict';

/* Services */
// utiles service
angular.module('ServiceUtiles', [])
        .service("ServiceUtiles", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = $localStorage.user.api+'/Utiles/';
 
                this.getListTva = function () {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: url + 'GetAllTva',
                        timeout: 15000,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getListunits = function () {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: url + 'GetAllUnite',
                        timeout: 15000,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getListEtats = function () {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: url + 'GetAllEtats',
                        timeout: 15000,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getListDevise = function () {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: url + 'GetAllDevise',
                        timeout: 15000,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getListModePaiements = function () {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: url + 'GetAllPaiementsMode',
                        timeout: 15000,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getParamsGenrals = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetParamsGen',
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

                this.updateParamsGenrals = function (params) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url + 'UpdateParamsGen',
                        timeout: 15000,
                        data: $.param({'data': params}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                //societe

                this.getDateExpirationSocicete = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetDateExpirationSocicete',
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

                this.getSociete = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetSociete',
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

                this.updateSociete = function (societe) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url + 'UpdateSociete',
                        timeout: 15000,
                        data: $.param({'data': societe}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                this.getParamsPdf = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetParamsPdf',
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

                this.updateParamsPdf = function (paramPdf) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url + 'UpdateParamsPdf',
                        timeout: 15000,
                        data: $.param({'data': paramPdf}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

                // permissions
                
                
                this.getPermission = function (idUser) {
                    var deferred = $q.defer();
                    var data = {
                        idUser: idUser
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetPermission',
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
                
                this.savePermission = function (permission) {
                    
                    var deferred = $q.defer();
                    if (permission.oper === 1) {
                        $http({
                            method: 'POST',
                            url: url + 'InsertPermission',
                            timeout: 15000,
                            data: $.param({'data': permission}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            
                            deferred.resolve(response.data);
                        }, function errorCallback(response) {
                            
                            deferred.resolve(response.data.msg);
                        });
                    } else {
                        $http({
                            method: 'POST',
                            url: url + 'UpdatePermission',
                            timeout: 15000,
                            data: $.param({'data': permission}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(function successCallback(response) {
                            
                            deferred.resolve(response.data);
                        }, function errorCallback(response) {
                            
                            deferred.resolve(response.data.msg);
                        });
                    }
                    return deferred.promise;
                };
                
                this.deletePermission = function (idUser) {
                    var deferred = $q.defer();
                    var data = {
                        idUser: idUser
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeletePermission',
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
                
                // states
               
                
                this.stateClient = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'StateClient',
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
                
                this.stateFournisseur = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'StateFournisseur',
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
                
                this.getAllFacturesVentesByYear = function (year,idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc,
                        filterYear: year
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllFacturesVentesByYear',
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
                
                this.getAllFacturesAchatsByYear = function (year,idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc,
                        filterYear: year
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllFacturesAchatsByYear',
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
                
                this.getClientsNvFactures = function (year,idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc,
                        filterYear: year
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetClientsNvFactures',
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
                
                this.getInfosFacturesAStats = function (year,idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc,
                        filterYear: year
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetInfosFacturesAStats',
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
                
                this.getInfosFacturesVStats = function (year,idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc,
                        filterYear: year
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetInfosFacturesVStats',
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
                
                this.getRevenuPaiementOnFAByYear = function (year,idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc,
                        filterYear: year
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetRevenuPaiementOnFAByYear',
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
                
                this.getRevenuPaiementOnFVByYear = function (year,idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc,
                        filterYear: year
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetRevenuPaiementOnFVByYear',
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