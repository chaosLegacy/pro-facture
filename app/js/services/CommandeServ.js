'use strict';

/* Services */
// clients service
angular.module('ServiceCommande', [])
        .service("ServiceCommande", ['$q', '$http', '$localStorage', function ($q, $http, $localStorage) {
                var url = $localStorage.user.api+'/Commande/';

                this.countCommande = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'CountCommande',
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
                
                //=======================
                //---- Module d'achat
                //=======================


                this.getListeCommandeAchat = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllCommandeAchat',
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

                this.getListeCommandeAchatEnCours = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllCommandeAchatEnCours',
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

                this.geCommandeAchat = function (idComm) {
                    var deferred = $q.defer();
                    var data = {
                        idCommande: idComm
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetCommandeAchat',
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

                this.saveCommandeAchat = function (commande) {
                    
                    var deferred = $q.defer();

                    if (commande.Oper === 1) {
                        $http({
                            method: 'POST',
                            url: url + 'InsertCommandeAchat',
                            timeout: 15000,
                            data: $.param({'data': commande}),
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
                            url: url + 'UpdateCommandeAchat',
                            timeout: 15000,
                            data: $.param({'data': commande}),
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

                this.deleteCommandeAchat = function (idComm) {
                    var deferred = $q.defer();
                    var data = {
                        idCommande: idComm
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeleteCommandeAchat',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        
                        deferred.resolve(response.data);
                    });
                    return deferred.promise;
                };


                this.generatePDFCommandeAchat = function (commande) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: 'js/services/pdf/pdfCommandeAchat.php',
                        timeout: 15000,
                        data: $.param({'data': commande}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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

                this.getListeCommandeVente = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllCommandeVente',
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

                this.getListeCommandeVenteEnCours = function (idSoc) {
                    var deferred = $q.defer();
                    var data = {
                        idSociete: idSoc
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetAllCommandeVenteEnCours',
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

                this.geCommandeVente = function (idComm) {
                    var deferred = $q.defer();
                    var data = {
                        idCommande: idComm
                    };
                    $http({
                        method: 'POST',
                        url: url + 'GetCommandeVente',
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

                this.saveCommandeVente = function (commande) {
                    
                    var deferred = $q.defer();

                    if (commande.Oper === 1) {
                        $http({
                            method: 'POST',
                            url: url + 'InsertCommandeVente',
                            timeout: 15000,
                            data: $.param({'data': commande}),
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
                            url: url + 'UpdateCommandeVente',
                            timeout: 15000,
                            data: $.param({'data': commande}),
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

                this.deleteCommandeVente = function (idComm) {
                    var deferred = $q.defer();
                    var data = {
                        idCommande: idComm
                    };
                    $http({
                        method: 'POST',
                        url: url + 'DeleteCommandeVente',
                        timeout: 15000,
                        data: $.param({'data': data}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        
                        deferred.resolve(response.data);
                    });
                    return deferred.promise;
                };

                this.generatePDFCommandeVente = function (commande) {
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: 'js/services/pdf/pdfCommandeVente.php',
                        timeout: 15000,
                        data: $.param({'data': commande}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        deferred.resolve(response.data);
                    }, function errorCallback(response) {
                        deferred.resolve(response.statusText);
                    });
                    return deferred.promise;
                };

            }]);