'use strict';

/* Controllers */
// articles controller
app.controller('HistoriquesController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', '$state', '$timeout', '$filter', '$localStorage', '$modal', 'toaster', function ($scope, ServiceUtiles, ServiceHistorique, $state, $timeout, $filter, $localStorage, $modal, toaster) {
        var idSociete = $scope.app.user.idSociete;
        var idUser = $scope.app.user.idUser;
        
        $scope.callHistorique = function () {
            $scope.Historiques = [];
            ServiceHistorique.getListeHistorique(idSociete).then(function (data) {
                
                $scope.Historiques = data;
                var user = "";
             
                var lastMois = "", moisaction = "";

                for (var i = 0; i < $scope.Historiques.length; i++) {
                    $scope.Historiques[i].time = $filter("TextToHour")($scope.Historiques[i].dateAction);

                    if ($scope.Historiques[i].typeAction !== 16 && $scope.Historiques[i].typeAction !== 17 && $scope.Historiques[i].typeAction !== 19 && $scope.Historiques[i].typeAction !== 31) {
                        var username = $scope.Historiques[i].nom+ " "+$scope.Historiques[i].prenom + " ";
                        user = $scope.affichageStringUser($scope.Historiques[i].idUser, idUser,username);
                    } else {
                        user = "";
                    }
                    
                    var date = new Date(1 * $scope.Historiques[i].dateAction);
                    var FormattedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

                    if (lastMois !== FormattedDate) {
                        moisaction = FormattedDate;
                        lastMois = FormattedDate;
                    }
                    else {
                        moisaction = "";
                    }
                    
                    if ($scope.Historiques[i].typeAction === 0 || $scope.Historiques[i].typeAction === 6 || $scope.Historiques[i].typeAction === 11 || $scope.Historiques[i].typeAction === 16 || $scope.Historiques[i].typeAction === 18 || $scope.Historiques[i].typeAction === 21 || $scope.Historiques[i].typeAction === 24 || $scope.Historiques[i].typeAction === 25 || $scope.Historiques[i].typeAction === 30 || $scope.Historiques[i].typeAction === 33 || $scope.Historiques[i].typeAction === 35 || $scope.Historiques[i].typeAction === 36 || $scope.Historiques[i].typeAction === 41 || $scope.Historiques[i].typeAction === 46 || $scope.Historiques[i].typeAction === 49 || $scope.Historiques[i].typeAction === 50 || $scope.Historiques[i].typeAction === 56 || $scope.Historiques[i].typeAction === 58 || $scope.Historiques[i].typeAction === 60 || $scope.Historiques[i].typeAction === 61 || $scope.Historiques[i].typeAction === 65) {
                        $scope.Historiques[i].wireClass = "b-success";
                    }
                    if ($scope.Historiques[i].typeAction === 1 || $scope.Historiques[i].typeAction === 7 || $scope.Historiques[i].typeAction === 12 || $scope.Historiques[i].typeAction === 14 || $scope.Historiques[i].typeAction === 27 || $scope.Historiques[i].typeAction === 22 || $scope.Historiques[i].typeAction === 31 || $scope.Historiques[i].typeAction === 36 || $scope.Historiques[i].typeAction === 38 || $scope.Historiques[i].typeAction === 42 || $scope.Historiques[i].typeAction === 47 || $scope.Historiques[i].typeAction === 66) {
                        $scope.Historiques[i].wireClass = "b-info";
                    }
                    if ($scope.Historiques[i].typeAction === 2 || $scope.Historiques[i].typeAction === 8 || $scope.Historiques[i].typeAction === 13 || $scope.Historiques[i].typeAction === 17 || $scope.Historiques[i].typeAction === 19 || $scope.Historiques[i].typeAction === 23 || $scope.Historiques[i].typeAction === 32 || $scope.Historiques[i].typeAction === 34 || $scope.Historiques[i].typeAction === 48 || $scope.Historiques[i].typeAction === 59) {
                        $scope.Historiques[i].wireClass = "b-danger";
                    }
                    if ($scope.Historiques[i].typeAction === 20) {
                        $scope.Historiques[i].wireClass = "b-warning";
                    }
                    $scope.Historiques[i].samury = $scope.dateToday(moisaction);
                    
                    $scope.Historiques[i].AffichageAction = user + $scope.AffichageAction($scope.Historiques[i].typeAction, $scope.Historiques[i].data, $scope.Historiques[i].idObjet);
                }
            });
        };
        
        $scope.callHistorique();
        
        $scope.dateToday = function (dateTest) {
            var date = new Date();
            var month = date.getMonth() + 1;
            if (month / 10 < 1) {
                month = 0 + '' + month;
            }
            var DateToday = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
            var DateYesterday = (date.getDate() - 1) + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
            if (dateTest === DateToday) {
                return "Aujourd'hui";
            }
            if (dateTest === DateYesterday) {
                return "Hier";
            }
            else {
                return dateTest;
            }
        };
        
        $scope.affichageStringUser = function (user, UserConnecte, username) {
            var stringStart = '';
            if (user === UserConnecte) {
                stringStart = "Vous avez ";
            } else {
                stringStart = username + " a ";
            }
            return stringStart;
        };

        $scope.AffichageAction = function (typeAction, data, idObjet) {
            // client
            if (typeAction === 0) {
                return " créé le client "+idObjet;
            }
            if (typeAction === 1) {
                return " modifié la fiche du client "+idObjet;
            }
            if (typeAction === 2) {
                return " supprimé le client "+idObjet;
            }
            // fournisseur
            if (typeAction === 6) {
                return " créé le fournisseur "+idObjet;
            }
            if (typeAction === 7) {
                return " modifié la fiche du fournisseur "+idObjet;
            }
            if (typeAction === 8) {
                return " supprimé le fournisseur "+idObjet;
            }
            // article
            if (typeAction === 11) {
                return " créé l'article "+idObjet;
            }
            if (typeAction === 12) {
                return " modifié la fiche de l'article "+idObjet;
            }
            if (typeAction === 13) {
                return " supprimé l'article "+idObjet;
            }
            // stock
            if (typeAction === 16) {
                return " créé une intervention de stock d'une quantité de "+ data +" pour l'article "+idObjet;
            }
            if (typeAction === 17) {
                return " supprimé une intervention de stock concernant l'article "+idObjet;
            }
            if (typeAction === 18) {
                return " Stock alimenté d'une quantite de "+ data +" concernant l'article "+idObjet;
            }
            if (typeAction === 19) {
                return " Stock réduit il vous reste que "+ data +" concernant l'article "+idObjet;
            }
            if (typeAction === 20) {
                return " Stock presque epuisé il vous reste "+ data +" concernant l'article "+idObjet;
            }
            //commande achat
            if (typeAction === 21) {
                return " créé la commande d'achat "+idObjet;
            }
            if (typeAction === 22) {
                return " modifié la commande d'achat "+idObjet;
            }
            if (typeAction === 23) {
                return " supprimé la commande d'achat "+idObjet;
            }
            if (typeAction === 24) {
                return " facturé la commande d'achat "+idObjet;
            }
            if (typeAction === 25) {
                return " validé la commande d'achat "+idObjet;
            }
            //facture achat
            if (typeAction === 30) {
                return " créé la facture d'achat "+idObjet;
            }
            if (typeAction === 31) {
                return " modifié la facture d'achat "+idObjet;
            }
            if (typeAction === 32) {
                return " supprimé la facture d'achat "+idObjet;
            }
            if (typeAction === 33) {
                return " ajouté un paiement de "+data+" concernant la facture d'achat "+idObjet;
            }
            if (typeAction === 34) {
                return " supprimé un paiement de "+data+" concernant la facture d'achat "+idObjet;
            }
            if (typeAction === 35) {
                return " clôturé la facture d'achat "+idObjet;
            }
            if (typeAction === 36) {
                return " envoyé la facture " + idObjet + " à l'adresse " + data + " ";
            }
            //bon livraiosn achat
            if (typeAction === 41) {
                return " ajouté la bon de livraiosn "+idObjet+" concernant la commande "+data;
            }
            if (typeAction === 42) {
                return " modifié la bon de livraiosn "+idObjet+" concernant la commande "+data;
            }
            //commande vente
            if (typeAction === 46) {
                return " créé la commande de vente "+idObjet;
            }
            if (typeAction === 47) {
                return " modifié la commande de vente "+idObjet;
            }
            if (typeAction === 48) {
                return " supprimé la commande de vente "+idObjet;
            }
            if (typeAction === 49) {
                return " facturé la commande de vente "+idObjet;
            }
            if (typeAction === 50) {
                return " validé la commande de vente "+idObjet;
            }
            //facture vente
            if (typeAction === 56) {
                return " créé la facture de vente "+idObjet;
            }
            if (typeAction === 57) {
                return " modifié la facture de vente "+idObjet;
            }
            if (typeAction === 58) {
                return " ajouté un paiement de "+data+" concernant la facture de vente "+idObjet;
            }
            if (typeAction === 59) {
                return " supprimé un paiement de "+data+" concernant la facture de vente "+idObjet;
            }
            if (typeAction === 60) {
                return " clôturé la facture de vente "+idObjet;
            }
            if (typeAction === 61) {
                return " envoyé la facture " + idObjet + " à l'adresse " + data + " ";
            }
            //bon livraiosn vente
            if (typeAction === 65) {
                return " ajouté la bon de livraiosn "+idObjet+" concernant la commande "+data;
            }
            if (typeAction === 66) {
                return " modifié la bon de livraiosn "+idObjet+" concernant la commande "+data;
            }
        };
        
        
    }]);

angular.module('app').filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});
angular.module('app').filter('TextToHour', function () {
    return function (items) {
        var date = new Date(1 * items);
        var formattedHour = date.getHours() + "h" + date.getMinutes() + "min";
        return formattedHour;
    };
});
angular.module('app').filter('TextToDate', function () {
    return function (items) {
        var date = new Date(1 * items);
        var formattedDates = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        return formattedDates;
    };
});
angular.module('app').filter('EgualDate', function () {
    return function (items) {
        var date = new Date(items);
        var formattedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        return formattedDate;
    };
});