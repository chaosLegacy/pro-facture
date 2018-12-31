'use strict';

/* Controllers */
// articles controller
app.controller('ArticlesController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceArticles', '$state', '$timeout', '$localStorage', '$modal', 'toaster', function ($scope, ServiceUtiles, ServiceHistorique, ServiceArticles, $state, $timeout, $localStorage, $modal, toaster) {
        var idSociete = $scope.app.user.idSociete;
        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        }
        function interactHisto(idObjet, typeHisto, typeAction, data) {
            var datAuj = new Date();
            var today = Date.parse(datAuj);
            var historique = {
                idSociete: idSociete,
                idUser: $scope.app.user.idUser,
                idObjet: idObjet,
                typeHisto: typeHisto,
                typeAction: typeAction,
                data: data,
                dateAction: today
            };
            ServiceHistorique.saveHistorique(historique);
        }
        //get params General devise
        ServiceUtiles.getParamsGenrals(idSociete).then(function (general) {
            $scope.paramsGen = general;
            ServiceUtiles.getListDevise().then(function (devise) {
                $scope.ListeDevise = devise;
                angular.forEach($scope.ListeDevise, function (value) {
                    if ($scope.paramsGen.idDefaultDevise === value.idDevise) {
                        $scope.currency = value.label;
                    }
                });
            });
        });
        // Charger la liste des articles
        ServiceArticles.getListeArticles(idSociete).then(function (data) {
            if (typeof data !== 'undefined') {
                ServiceUtiles.getListTva().then(function (allTva) {
                    ServiceUtiles.getListunits().then(function (allUnits) {
                        $scope.ListeArticles = data;

                        $scope.ListeTva = allTva;
                        $scope.Listeunits = allUnits;

                        angular.forEach($scope.ListeArticles, function (article) {
                            angular.forEach($scope.ListeTva, function (tva) {
                                if (article.idTva === tva.idTva) {
                                    article.tva = tva.valeur;
                                }
                            });

                            angular.forEach($scope.Listeunits, function (unite) {
                                if (article.idUnite === unite.idUnite) {
                                    article.unite = unite.label;
                                }
                            });
                        });

                    });
                });

            } else {
                $scope.ListeArticles = [];
            }
        });

        // trier les clients croissant décroissant 
        $scope.sort = [
            {label: 'reference'},
            {label: 'unit'},
            {label: 'tva'},
            {label: 'prixA'}
        ];
        $scope.reverse = false;
        $scope.orderBy = function (value) {
            angular.forEach($scope.sort, function (data) {
                if (data.label === value) {
                    $scope.reverse = !$scope.reverse;
                    return;
                }
            });
            $scope.sort.label = value;
        };

        // Actions clients
        $scope.selectedAction = function (action, article) {
            switch (action) {
                case 'selectArticle':
                    $scope.selectArticle(article);
                    break;
                case 'updateArticle':
                    $scope.updateArticle(article.idArticle);
                    break;
                case 'deleteArticle':
                    $scope.deleteArticle(article.idArticle);
                    break;
            }
        };
        // action call addArticle
        $scope.addArticle = function () {
            $state.go('app.gesArticle');
        };

        $scope.selectArticle = function (article) {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'monTemplate.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'data',
                    function ($scope, $modalInstance, scopeParent, data) {
                        
                        if ((data !== "") && (typeof data !== 'undefined')) {
                            $scope.currency = scopeParent.currency;
                            $scope.article = {
                                idArticle: data.idArticle,
                                reference: data.reference,
                                designation: data.designation,
                                description: data.description,
                                idCategorie: data.idCategorie,
                                email: data.email,
                                qte: data.qte,
                                prixA: data.prixA,
                                prixV: data.prixV,
                                idUnite: data.idUnite,
                                unit: data.unite,
                                tva: data.tva,
                                idTva: data.idTva,
                                idNature: data.idNature,
                                photo: data.photo,
                                Oper: 2
                            };
                        }
                        $scope.editArticle = function () {
                            scopeParent.updateArticle(data.idArticle);
                            $modalInstance.close();
                        };
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                resolve: {
                    scopeParent: function () {
                        return $scope;
                    },
                    data: function () {
                        return article;
                    }
                }
            });
        };

        $scope.updateArticle = function (idArticle) {
            $state.go('app.gesArticle', {idArt: idArticle});
        };

        $scope.deleteArticle = function (idArticle) {
            ServiceArticles.deleteArticle(idArticle).then(function (response) {
                if (response.status === 'Failed') {
                    notifyBox('Erreur', response.msg, 'error');
                } else {
                    angular.forEach($scope.ListeArticles, function (article, index) {
                        if (article.idArticle === idArticle) {
                            $scope.ListeArticles.splice(index, 1);
                            interactHisto(article.reference, 'article', 13, '');
                            notifyBox('Succès', 'Supression Article: ' + article.reference + ' effectué avec succès', 'success');
                        }
                    });
                }

            });
        };

    }]);