'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', 'ServiceUsers', '$state', '$timeout', '$localStorage', function ($scope, ServiceUsers, $state, $timeout, $localStorage) {
    $scope.user = {};
    $scope.authError = null;
    $scope.authSuccess = null;

    var rootDir = $scope.app.rootDir;
    // $scope.app.user = {
    //     "idUser": "",
    //     "idSociete": "",
    //     "login": "",
    //     "lastLogin": "",
    //     "userName": "",
    //     "societeName": "",
    //     "picture": "",
    //     "mission": "",
    //     "typeAbonnement": "",
    //     "accessToken": "",
    //     "api": ""
    // };

    (function initController() {
        // reset login status
        ServiceUsers.ClearCredentials();
    })();

    $scope.login = function (form) {

        if (form.$valid) {
            ServiceUsers.getUser($scope.user).then(function (response) {
                if (typeof response === 'object') {
                    $scope.app.user.idUser = response.idUser;
                    $scope.app.user.idSociete = response.idSociete;
                    $scope.app.user.login = response.login;
                    $scope.app.user.lastLogin = response.lastLogin;
                    $scope.app.user.societeName = response.nomSoc;
                    if (response.nom !== "" || response.prenom !== "") {
                        $scope.app.user.userName = response.nom + " " + response.prenom;
                    } else {
                        $scope.app.user.userName = response.nomSoc;
                    }
                    $scope.app.user.picture = response.photo;
                    $scope.app.user.mission = response.mission;
                    $scope.app.user.accessToken = response.accesToken;
                    $scope.app.user.typeAbonnement = response.idabonnement;

                    ServiceUsers.SetCredentials(response.login, response.accesToken);

                    if (response.lastLogin === null) {
                        ServiceUsers.buildUserFolder(response.nomSoc, rootDir);
                    }
                    ServiceUsers.upadateUserStatus(response.idUser, 1);

                    $('.loader').addClass('visible');
                    $scope.authError = null;
                    $scope.authSuccess = 'Merci de patienter, vous allez etre rederiger dans quelque instant.';

                    $timeout(function () {
                        $('.loader').removeClass('visible');
                        $state.go('app.dashboard');
                    }, 3000);
                } else {
                    $scope.authError = 'Une erreur est survenu : ' + response;
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