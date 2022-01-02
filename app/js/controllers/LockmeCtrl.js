'use strict';

/* Controllers */
// articles controller
app.controller('LockmeController', ['$scope', 'ServiceUsers', '$state','$location', '$timeout', '$localStorage', 'toaster', function ($scope, ServiceUsers, $state, $location, $timeout, $localStorage, toaster) {
        var idUser = $scope.app.user.idUser;
        ServiceUsers.upadateUserStatus(idUser, 2);
        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        }
        $scope.user = {
            login: $scope.app.user.login,
            password: '',
            isAuth: false
        };
        var path = "app/dashboard";
        $scope.$on('$locationChangeStart', function (event, next, current) {
            if($state.current.url === '/lockme' && $scope.user.isAuth === false) {
               // path = current;
               $state.go('lockme'); 
            }
        });
        $scope.unlock = function () {
            if ($scope.user.password === '') {
                notifyBox('Erreur', 'Mot de passe obligatoire pour continuer', 'error');
            } else {
                var user = {
                    email: $scope.user.login,
                    password: $scope.user.password
                };
                ServiceUsers.getUser(user).then(function (response) {
                   if(typeof response === 'string') {
                       notifyBox('Erreur', 'Mot de passe incorrect', 'error');
                   } else {debugger;
                       $scope.user.isAuth = true;
                       //$state.go('app.dashboard');
                       ServiceUsers.upadateUserStatus(idUser, 1);
                       $location.path(path);
                   }
                });
            }
        };



    }]);