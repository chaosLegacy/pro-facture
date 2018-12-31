'use strict';

/* Controllers */
// articles controller
app.controller('StockController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceArticles', '$state', '$timeout', '$modal', 'toaster', '$filter', function ($scope, ServiceUtiles, ServiceHistorique, ServiceArticles, $state, $timeout, $modal, toaster, $filter) {
        var idSociete = $scope.app.user.idSociete;
        function notifyBox(title, msg, type) {
            $scope.toaster = {
                type: type,
                title: title,
                text: msg
            };
            toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
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

        // Charger la liste de stock
        function getListeStock() {
            ServiceArticles.getListeStock(idSociete).then(function (data) {
                $scope.ListeStock = data;
            });
        }
        getListeStock();
        // Charger la liste des articles
        ServiceArticles.getListeArticles(idSociete).then(function (data) {
            if (typeof data !== 'undefined') {
                ServiceUtiles.getListTva().then(function (allTva) {
                    ServiceUtiles.getListunits().then(function (allUnits) {
                        $scope.ListeArticles = data;
                        $scope.totalItems = data.length;

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
                $scope.ListeStock = [];
            }
        });

        $scope.currentPage = 1;
        $scope.maxSize = 5;

        // trier les clients croissant décroissant 
        $scope.sort = [
            {label: 'reference'},
            {label: 'qte'},
            {label: 'date'}
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

        $scope.dateCre = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedCre = true;
        };

        function emptyDataStock() {
            $scope.stock = {
                idArticle: '',
                refArticle: '',
                qte: 0,
                description: 'Intérvention de stock concernant l\'article: ',
                date: $filter("date")(new Date(), 'yyyy-MM-dd hh:mm:ss')
            };
        }
        emptyDataStock();
        function checkDataStock(stock) {
            if (stock.idArticle === '' && stock.refArticle === '') {
                return 'Vous devez choisir une référence dans la liste des paiements';
            }
            if (stock.qte == 0 || stock.qte === '') {
                return 'Quantité obligatoire';
            } else if (isNaN(stock.qte)) {
                return 'Seule les chiffres sont permis';
            }

            return '';
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
        
        $scope.addStock = function () {
            emptyDataStock();
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'addStock.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'stock',
                    function ($scope, $modalInstance, scopeParent, stock) {
                        $scope.stock = stock;
                        $scope.dateCre = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.openedCre = true;
                        };

                        $scope.getListeArticles = function () {
                            scopeParent.getListeArticles();
                        };

                        $scope.addStock = function (stockArticle) {
                            var msg = checkDataStock(stockArticle);
                            if (msg !== '') {
                                notifyBox("Erreur", msg, 'warning');
                            } else {
                                stockArticle.idSociete = idSociete;
                                stockArticle.date = $filter("date")(new Date(stockArticle.date), 'yyyy-MM-dd hh:mm:ss');
                                ServiceArticles.saveStock(stockArticle).then(function () {
                                    getListeStock();
                                    interactHisto(stockArticle.refArticle, 'stock', 16, stockArticle.qte);
                                    notifyBox('Succès', 'Stock : ' + stockArticle.refArticle + ' ajouté avec succès', 'success');
                                });
                                $modalInstance.close();
                            }

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
                    stock: function () {
                        return $scope.stock;
                    }
                }
            });
        };

        $scope.getListeArticles = function () {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'listeArticles.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'stock',
                    function ($scope, $modalInstance, scopeParent, stock) {
                        $scope.currency = scopeParent.currency;
                        $scope.ListeArticles = scopeParent.ListeArticles;

                        $scope.getArticle = function (article) {
                            emptyDataStock();
                            stock.idArticle = article.idArticle;
                            stock.refArticle = article.reference;
                            stock.qte = article.qte;
                            stock.description = 'Intérvention de stock concernant l\'article: ';
                            stock.description += article.reference;
                            scopeParent.stock = stock;
                            $modalInstance.close();
                        };
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                size: 'lg',
                resolve: {
                    scopeParent: function () {
                        return $scope;
                    },
                    stock: function () {
                        return $scope.stock;
                    }
                }
            });
        };



        $scope.selectStock = function (article) {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'monTemplate.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'data',
                    function ($scope, $modalInstance, scopeParent, data) {
                        
                        if ((data !== "") && (typeof data !== 'undefined')) {
                            $scope.currency = scopeParent.currency;
                            angular.forEach(scopeParent.ListeArticles, function (article) {
                                if (article.idArticle === data.idArticle) {
                                    $scope.article = {
                                        idArticle: article.idArticle,
                                        reference: data.reference,
                                        designation: article.designation,
                                        description: data.description,
                                        idCategorie: article.idCategorie,
                                        qte: data.qte,
                                        prixA: article.prixA,
                                        prixV: article.prixV,
                                        idUnite: article.idUnite,
                                        unit: article.unite,
                                        tva: article.tva,
                                        idTva: article.idTva,
                                        idNature: article.idNature,
                                        photo: article.photo,
                                        Oper: 2
                                    };
                                }
                            });

                        }
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

        $scope.deleteStock = function (idStock) {
            ServiceArticles.deleteStock(idStock).then(function () {
                angular.forEach($scope.ListeStock, function (stock, index) {
                    if (stock.idStock === idStock) {
                        $scope.ListeStock.splice(index, 1);
                        interactHisto(stock.reference, 'stock', 17, '');
                        notifyBox('Succès', 'Supression paiement: ' + stock.refArticle + ' effectué avec succès', 'success');
                    }
                });
            });
        };


    }]);