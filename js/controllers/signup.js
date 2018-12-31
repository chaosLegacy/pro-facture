'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', 'ServiceUsers', '$state', '$filter', '$timeout', function ($scope, ServiceUsers, $state, $filter, $timeout) {
        $scope.user = {};
        $scope.societe = {};

        $scope.authError = null;
        $scope.authSuccess = null;

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function checkData(validator) {

            if (validator.$error.required) {
                return "le champ: <b>" + validator.$name + "</b> est <b>obligatoire</b>.<br/>";

            } else if (validator.$error.minlength) {
                return "le champ: <b>" + validator.$name + "</b> est trop court.<br/>";

            } else if (validator.$error.maxlength) {
                return "Vous avez dépassé la taille recommandés pour le champ: <b>" + validator.$name + "</b>.<br/>";

            } else if (validator.$error[validator.$name]) {
                return "le champ: <b>" + validator.$name + "</b> est invalide.<br/>";

            } else if (validator.$error.compareTo) {
                return "Les deux mots de passes ne sont pas identiques.<br/>";

            }

            return '';

        }

        $scope.signup = function (form) {
            
            var msg = "";

            if (!form.$valid) {
                angular.forEach(form.$error, function (input) {
                    angular.forEach(input, function (validator) {
                        msg += checkData(validator);
                    });
                });
            }
            if (msg !== '') {
                $scope.authError = msg;
            }
            else if (form.$valid) {
                //var emailsolit = $scope.user.email.split("@");
                var data = {
                    "user": {
                        //"nom": emailsolit[0],
                        "login": $scope.user.email,
                        "password": $scope.user.password
                    },
                    "societe": {
                        "email": $scope.user.email,
                        "tel": $scope.societe.tel,
                        "nom": $scope.societe.nom,
                        "typeAbonnement": 0,
                        "dateCreation": $filter("date")(new Date(), 'yyyy-MM-dd hh:mm:ss')
                    }
                };
                ServiceUsers.addUser(data).then(function (response) {
                    
                    if (typeof response === 'object') {
                        console.log(response);
                        $('.loader').addClass('visible');
                        $scope.authError = null;
                        $scope.authSuccess = 'Merci de patienter, vous allez etre rederiger dans quelque instant.';
                        $timeout(function () {
                            $('.loader').removeClass('visible');
                            $state.go('access.signin');
                        }, 3000);
                    } else {
                        $scope.authError = null;
                        $scope.authError = 'Une erreur est survenu : ' + response;
                        console.log(response);
                    }
                });
            }


        };

    }]);