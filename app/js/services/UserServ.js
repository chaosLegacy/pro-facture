'use strict';

/* Services */
// users service
angular.module('ServiceUsers', [])
    .service("ServiceUsers", ['$q', '$http', '$localStorage', '$rootScope', '$cookieStore', function ($q, $http, $localStorage, $rootScope, $cookieStore) {
        var url = $localStorage.user.api + '/User/';

        this.getUser = function (user) {
            var deferred = $q.defer();
            var data = {
                email: user.email,
                password: user.password
            };

            $http({
                method: 'POST',
                url: url + 'GetUser',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                if (response.data && response.data.msg) {
                    deferred.resolve(response.data.msg);
                }

            });
            return deferred.promise;
        };

        this.getInfoUser = function (idSoc, idUser) {
            var deferred = $q.defer();
            var data = {
                idSociete: idSoc,
                idUser: idUser,
            };

            $http({
                method: 'POST',
                url: url + 'GetInfoUser',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.data.msg);
            });
            return deferred.promise;
        };

        this.getSubusers = function (idSoc) {
            var deferred = $q.defer();
            var data = {
                idSociete: idSoc
            };

            $http({
                method: 'POST',
                url: url + 'GetAllSubusers',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.data.msg);
            });
            return deferred.promise;
        };

        this.addUser = function (user) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: url + 'AddUser',
                timeout: 15000,
                data: $.param({ 'data': user }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.data.msg);
            });
            return deferred.promise;
        };

        this.saveSubUser = function (subUser) {
            var deferred = $q.defer();

            if (subUser.oper === 1) {
                $http({
                    method: 'POST',
                    url: url + 'InsertSubUser',
                    timeout: 15000,
                    data: $.param({ 'data': subUser }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    deferred.resolve(response.data.msg);
                });
            } else {
                $http({
                    method: 'POST',
                    url: url + 'UpdateSubUser',
                    timeout: 15000,
                    data: $.param({ 'data': subUser }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    deferred.resolve(response.data.msg);
                });
            }
            return deferred.promise;
        };

        this.updateUser = function (user) {
            debugger;
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: url + 'UpdateUser',
                timeout: 15000,
                data: $.param({ 'data': user }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response.data.msg);
            });
            return deferred.promise;
        };

        this.updateUserMdp = function (user) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: url + 'UpdateUserMdp',
                timeout: 15000,
                data: $.param({ 'data': user }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        this.buildUserFolder = function (nomSociete, rootDir) {
            var deferred = $q.defer();
            var data = {
                nomSociete: nomSociete,
                rootDir: rootDir
            };
            $http({
                method: 'POST',
                url: 'js/services/buildDirs.php',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response);
            }, function errorCallback(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        this.upadateUserStatus = function (idUser, status) {
            var deferred = $q.defer();
            var data = {
                idUser: idUser,
                status: status
            };
            $http({
                method: 'POST',
                url: url + 'UpdatedUserStatus',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response);
            }, function errorCallback(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        this.deleteUser = function (idUser) {
            var deferred = $q.defer();
            var data = {
                idUser: idUser
            };
            $http({
                method: 'POST',
                url: url + 'DeleteUser',
                timeout: 15000,
                data: $.param({ 'data': data }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                deferred.resolve(response);
            }, function errorCallback(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };


        this.SetCredentials = function (login, token) {
            $rootScope.globals = {
                currentUser: {
                    username: login,
                    authdata: token
                }
            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
            $cookieStore.put('globals', $rootScope.globals);
        };

        this.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        };

    }]);