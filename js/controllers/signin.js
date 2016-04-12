'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', 'ServiceUsers', '$state', '$timeout', '$localStorage', function ($scope, ServiceUsers, $state, $timeout, $localStorage) {
        $scope.user = {};
        $scope.authError = null;
        $scope.authSuccess = null;

        $scope.$storage = $localStorage.$default({
            "idUser": "",
            "login": "",
            "accessToken": "",
            "lastLogin": "",
            "userName": "",
            "companyName": "",
            "userPicture": "",
            "abonnement": ""
        });
        (function initController() {
                        // reset login status
                        ServiceUsers.ClearCredentials();
                })();

        $scope.login = function (form) {

            if (form.$valid) {
                ServiceUsers.getUser($scope.user).then(function (response) {
                    debugger;
                    if (typeof response === 'object') {
                        $localStorage.idUser = response.idUser;
                        $localStorage.lastLogin = response.lastLogin;
                        $localStorage.login = response.login;
                        $localStorage.userPicture = response.photo;
                        $localStorage.companyName = response.nomSoc;
                        $localStorage.userName = response.nom + " " + response.prenom;
                        if (response.lastLogin === null && response.active === 0) {
                            $localStorage.userName = response.nomSoc;
                        }
                        $localStorage.accessToken = response.accesToken;
                        $localStorage.abonnement = 0;
                        
                        ServiceUsers.SetCredentials(response.login, response.accesToken);
                        console.log(response);
                        $('.loader').addClass('visible');
                        $scope.authError = null;
                        $scope.authSuccess = 'Merci de patienter, vous allez etre rederiger dans quelque instant.';
                        $timeout(function () {
                            $('.loader').removeClass('visible');
                            $state.go('app.dashboard');
                        }, 3000);
                    } else {
                        $scope.authError = 'Une erreur est survenu : ' + response;
                        console.log(response);
                    }
                });
            } else {
                $scope.authError = 'Veuillez remplir votre formulaire avec des donnés valide';
            }


        };
        $scope.astuces = [{
                icon: 'glyphicon-question-sign',
                title: 'Le saviez-vous ?',
                description: "En créant un compte <strong>Pro-facture</strong>, vous n'avez aucune obligation, aucun engagement de durée ni aucune installation à réaliser." +
                        "Vous pouvez utiliser l'application sans restriction. Créer des factures de manière simple et rapide !" +
                        "A tout moment, vous pouvez supprimer votre compte et toutes les données rattachées, résilier votre abonnement ou réinitialiser votre compte." +
                        "Aucun numéro de carte de crédit ne vous sera demandé durant votre période d'essai.",
            }, {
                icon: 'glyphicon-user',
                title: 'Gérez vos factures impayées et relancez vos clients !',
                description: "Evoliz met à votre disposition un système de gestion des relances client." +
                        "Evoliz vous indique les clients en retard de paiement et vous donne la possibilité de leur envoyer une lettre de relance.",
            }, {
                icon: 'glyphicon-question-sign',
                title: 'Le saviez-vous 3 ?',
                description: "En créant un compte <strong>Pro-facture</strong>, vous n'avez aucune obligation, aucun engagement de durée ni aucune installation à réaliser." +
                        "Vous pouvez utiliser l'application sans restriction. Créer des factures de manière simple et rapide !" +
                        "A tout moment, vous pouvez supprimer votre compte et toutes les données rattachées, résilier votre abonnement ou réinitialiser votre compte." +
                        "Aucun numéro de carte de crédit ne vous sera demandé durant votre période d'essai.",
            }];

    }])
        ;