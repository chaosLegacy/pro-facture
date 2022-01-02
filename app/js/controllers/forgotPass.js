'use strict';

/* Controllers */
// forgot password controller
app.controller('ForgotPassFormController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        
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
                        "Evoliz vous indique les clients en retard de paiement et vous donne la possibilité de leur envoyer une lettre de relance." ,
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