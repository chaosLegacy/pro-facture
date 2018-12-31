'use strict';

/**
 * Config for the router
 */
angular.module('app')
        .run(
                ['$rootScope', '$state', '$stateParams', '$location', '$cookieStore', '$http', 'Idle',
                    function ($rootScope, $state, $stateParams, $location, $cookieStore, $http, Idle) {
                        $rootScope.$state = $state;
                        $rootScope.$stateParams = $stateParams;

                        // keep user logged in after page refresh
                        $rootScope.globals = $cookieStore.get('globals') || {};
                        if ($rootScope.globals.currentUser) {
                            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
                        }

                        $rootScope.$on('$locationChangeStart', function (event, next, current) {
                            // redirect to login page if not logged in and trying to access a restricted page
                            var restrictedPage = $.inArray($location.path(), ['/access/signin', '/access/signup', '/access/forgotpwd']) === -1;
                            var loggedIn = $rootScope.globals.currentUser;
                            if (restrictedPage && !loggedIn) {
                                $location.path('/access/signin');
                            } else {
                                Idle.unwatch();
                                Idle.watch();
                            }
                        });

                        $rootScope.$on('IdleTimeout', function () {
                            // end their session and redirect to login
                            var restrictedPage = $.inArray($location.path(), ['/access/signin', '/access/signup', '/access/forgotpwd', '/lockme']) === -1;
                            var loggedIn = $rootScope.globals.currentUser;
                            if (restrictedPage && loggedIn) {
                                $state.go('lockme', {}, {location: true});
                            }

                        });

                    }
                ]
                )
        .config(
                ['$stateProvider', '$urlRouterProvider', 'IdleProvider', 'KeepaliveProvider',
                    function ($stateProvider, $urlRouterProvider, IdleProvider, KeepaliveProvider) {
                        IdleProvider.idle(10 * 60); // 10 minutes idle
                        IdleProvider.timeout(30); // after 30 seconds idle, time the user out
                        KeepaliveProvider.interval(5 * 60); // 5 minute keep-alive ping

                        $urlRouterProvider.otherwise(function ($injector) {
                            $injector.invoke(['$state', function ($state) {
                                    $state.go('access.404', {}, {location: false});
                                }]);
                        });
                        $stateProvider
                                .state('app', {
                                    abstract: true,
                                    url: '/app',
                                    templateUrl: 'tpl/app.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['angular-toasty', 'ServiceUtiles', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/RootCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.dashboard', {
                                    url: '/dashboard',
                                    templateUrl: 'tpl/home.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['toaster', 'ServiceUtiles']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/HomeCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.historique', {
                                    url: '/historique',
                                    templateUrl: 'tpl/historique.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['toaster', 'ServiceUtiles', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/HistoriqueCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.clients', {
                                    url: '/listeClients',
                                    templateUrl: 'tpl/clients.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['toaster', 'ServiceClients', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/ClientsCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesClient', {
                                    url: '/gestionClient/:idCli',
                                    templateUrl: 'tpl/gesClient.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['toaster', 'ServiceClients', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesClientCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.ficheClient', {
                                    url: '/ficheClient/:idCli',
                                    templateUrl: 'tpl/ficheClient.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceClients', 'toaster']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesClientCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.fournisseurs', {
                                    url: '/listeFournisseurs',
                                    templateUrl: 'tpl/fournisseurs.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceFournisseurs', 'toaster', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/FournisseursCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesFournisseur', {
                                    url: '/gestionFournisseur/:idFour',
                                    templateUrl: 'tpl/gesFournisseur.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceFournisseurs', 'toaster', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesFournisseurCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.ficheFournisseur', {
                                    url: '/ficheFournisseur/:idFour',
                                    templateUrl: 'tpl/ficheFournisseur.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['toaster', 'ServiceFournisseurs']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesFournisseurCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.stock', {
                                    url: '/stock',
                                    templateUrl: 'tpl/stock.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceArticles', 'toaster', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/StockCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.articles', {
                                    url: '/listeArticles',
                                    templateUrl: 'tpl/articles.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceArticles', 'toaster', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/ArticlesCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesArticle', {
                                    url: '/gestionArticle/:idArt',
                                    templateUrl: 'tpl/gesArticle.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceArticles', 'toaster', 'angularFileUpload', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesArticleCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                // achats
                                .state('app.commandeAchat', {
                                    url: '/listeCommandeAchat',
                                    templateUrl: 'tpl/commandeAchat.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceCommande', 'ServiceFournisseurs', 'toaster', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/CommandeACtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesCommandeAchat', {
                                    url: '/gestionCommandeAchat/:idComm',
                                    templateUrl: 'tpl/gesCommandeAchat.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceArticles', 'ServiceCommande', 'toaster', 'ServiceFournisseurs', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesCommandeACtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.factureAchat', {
                                    url: '/listeFactureAchat',
                                    templateUrl: 'tpl/factureAchat.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceFacture', 'ServiceCommande', 'ServiceFournisseurs', 'toaster']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/FactureACtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesFactureAchat', {
                                    url: '/gestionFactureAchat/:idFact',
                                    templateUrl: 'tpl/gesFactureAchat.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceFacture', 'ServiceCommande', 'ServiceFournisseurs', 'toaster', 'angularFileUpload', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesFactureACtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.bonLivraisonAchat', {
                                    url: '/listeBonLivraisonAchat',
                                    templateUrl: 'tpl/bonLivraisonAchat.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceBonLivraison', 'ServiceCommande', 'ServiceFournisseurs', 'toaster']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/BonLivraisonACtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesBonLivraisonAchat', {
                                    url: '/gestionBonLivraisonAchat/:idBL',
                                    templateUrl: 'tpl/gesBonLivraisonAchat.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceBonLivraison', 'ServiceCommande', 'ServiceFournisseurs', 'toaster', 'angularFileUpload', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesBonLivraisonACtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                // ventes
                                .state('app.commandeVente', {
                                    url: '/listeCommandeVente',
                                    templateUrl: 'tpl/commandeVente.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceCommande', 'ServiceClients', 'toaster']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/CommandeVCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesCommandeVente', {
                                    url: '/gestionCommandeVente/:idComm',
                                    templateUrl: 'tpl/gesCommandeVente.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceArticles', 'ServiceCommande', 'toaster', 'ServiceClients', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesCommandeVCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.factureVente', {
                                    url: '/listeFactureVente',
                                    templateUrl: 'tpl/factureVente.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceFacture', 'ServiceCommande', 'ServiceClients', 'toaster']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/FactureVCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesFactureVente', {
                                    url: '/gestionFactureVente/:idFact',
                                    templateUrl: 'tpl/gesFactureVente.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceFacture', 'ServiceCommande', 'ServiceClients', 'toaster', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesFactureVCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.bonLivraisonVente', {
                                    url: '/listeBonLivraisonVente',
                                    templateUrl: 'tpl/bonLivraisonVente.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceBonLivraison', 'ServiceCommande', 'ServiceClients', 'toaster']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/BonLivraisonVCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.gesBonLivraisonVente', {
                                    url: '/gestionBonLivraisonVente/:idBL',
                                    templateUrl: 'tpl/gesBonLivraisonVente.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceBonLivraison', 'ServiceCommande', 'ServiceClients', 'toaster', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/gesBonLivraisonVCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })

                                .state('app.paiements', {
                                    url: '/listePaiements/',
                                    templateUrl: 'tpl/paiements.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', "ServicePaiements", 'ServiceFacture', 'ServiceFournisseurs', 'ServiceClients', 'toaster', 'ServiceHistorique']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/PaiementsCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })


                                .state('app.dashboard-v1', {
                                    url: '/dashboard-v1',
                                    templateUrl: 'tpl/app_dashboard_v1.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['js/controllers/chart.js']);
                                            }]
                                    }
                                })
                                .state('app.dashboard-v2', {
                                    url: '/dashboard-v2',
                                    templateUrl: 'tpl/app_dashboard_v2.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['js/controllers/chart.js']);
                                            }]
                                    }
                                })
                                .state('app.ui', {
                                    url: '/ui',
                                    template: '<div ui-view class="fade-in-up"></div>'
                                })
                                .state('app.ui.buttons', {
                                    url: '/buttons',
                                    templateUrl: 'tpl/ui_buttons.html'
                                })
                                .state('app.ui.icons', {
                                    url: '/icons',
                                    templateUrl: 'tpl/ui_icons.html'
                                })
                                .state('app.ui.grid', {
                                    url: '/grid',
                                    templateUrl: 'tpl/ui_grid.html'
                                })
                                .state('app.ui.widgets', {
                                    url: '/widgets',
                                    templateUrl: 'tpl/ui_widgets.html'
                                })
                                .state('app.ui.bootstrap', {
                                    url: '/bootstrap',
                                    templateUrl: 'tpl/ui_bootstrap.html'
                                })
                                .state('app.ui.sortable', {
                                    url: '/sortable',
                                    templateUrl: 'tpl/ui_sortable.html'
                                })
                                .state('app.ui.portlet', {
                                    url: '/portlet',
                                    templateUrl: 'tpl/ui_portlet.html'
                                })
                                .state('app.ui.timeline', {
                                    url: '/timeline',
                                    templateUrl: 'tpl/ui_timeline.html'
                                })
                                .state('app.ui.tree', {
                                    url: '/tree',
                                    templateUrl: 'tpl/ui_tree.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/tree.js');
                                                        }
                                                );
                                            }
                                        ]
                                    }
                                })
                                .state('app.ui.toaster', {
                                    url: '/toaster',
                                    templateUrl: 'tpl/ui_toaster.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('toaster').then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/toaster.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('app.ui.jvectormap', {
                                    url: '/jvectormap',
                                    templateUrl: 'tpl/ui_jvectormap.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('js/controllers/vectormap.js');
                                            }]
                                    }
                                })
                                .state('app.ui.googlemap', {
                                    url: '/googlemap',
                                    templateUrl: 'tpl/ui_googlemap.html',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load([
                                                    'js/app/map/load-google-maps.js',
                                                    'js/app/map/ui-map.js',
                                                    'js/app/map/map.js']).then(
                                                        function () {
                                                            return loadGoogleMaps();
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('app.chart', {
                                    url: '/chart',
                                    templateUrl: 'tpl/ui_chart.html',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load('js/controllers/chart.js');
                                            }]
                                    }
                                })
                                // table
                                .state('app.table', {
                                    url: '/table',
                                    template: '<div ui-view></div>'
                                })
                                .state('app.table.static', {
                                    url: '/static',
                                    templateUrl: 'tpl/table_static.html'
                                })
                                .state('app.table.datatable', {
                                    url: '/datatable',
                                    templateUrl: 'tpl/table_datatable.html'
                                })
                                .state('app.table.footable', {
                                    url: '/footable',
                                    templateUrl: 'tpl/table_footable.html'
                                })
                                .state('app.table.grid', {
                                    url: '/grid',
                                    templateUrl: 'tpl/table_grid.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('ngGrid').then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/grid.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                // form
                                .state('app.form', {
                                    url: '/form',
                                    template: '<div ui-view class="fade-in"></div>',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load('js/controllers/form.js');
                                            }]
                                    }
                                })
                                .state('app.form.elements', {
                                    url: '/elements',
                                    templateUrl: 'tpl/form_elements.html'
                                })
                                .state('app.form.validation', {
                                    url: '/validation',
                                    templateUrl: 'tpl/form_validation.html'
                                })
                                .state('app.form.wizard', {
                                    url: '/wizard',
                                    templateUrl: 'tpl/form_wizard.html'
                                })
                                .state('app.form.fileupload', {
                                    url: '/fileupload',
                                    templateUrl: 'tpl/form_fileupload.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('angularFileUpload').then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/file-upload.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('app.form.imagecrop', {
                                    url: '/imagecrop',
                                    templateUrl: 'tpl/form_imagecrop.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('ngImgCrop').then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/imgcrop.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('app.form.select', {
                                    url: '/select',
                                    templateUrl: 'tpl/form_select.html',
                                    controller: 'SelectCtrl',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('ui.select').then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/select.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('app.form.slider', {
                                    url: '/slider',
                                    templateUrl: 'tpl/form_slider.html',
                                    controller: 'SliderCtrl',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('vr.directives.slider').then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/slider.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('app.form.editor', {
                                    url: '/editor',
                                    templateUrl: 'tpl/form_editor.html',
                                    controller: 'EditorCtrl',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load('textAngular').then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/editor.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                // pages
                                .state('app.page', {
                                    url: '/page',
                                    template: '<div ui-view class="fade-in-down"></div>'
                                })
                                .state('app.page.profile', {
                                    url: '/profile',
                                    templateUrl: 'tpl/page_profile.html',
                                    controller: 'SettingsCtrl',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['ServiceUtiles', 'ServiceUsers', 'angularFileUpload', 'toaster']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/SettingsCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('app.page.post', {
                                    url: '/post',
                                    templateUrl: 'tpl/page_post.html'
                                })
                                .state('app.page.search', {
                                    url: '/search',
                                    templateUrl: 'tpl/page_search.html'
                                })
                                .state('app.page.invoice', {
                                    url: '/invoice',
                                    templateUrl: 'tpl/page_invoice.html'
                                })
                                .state('app.page.price', {
                                    url: '/price',
                                    templateUrl: 'tpl/page_price.html'
                                })
                                .state('app.docs', {
                                    url: '/docs',
                                    templateUrl: 'tpl/docs.html'
                                })
                                // others
                                .state('lockme', {
                                    url: '/lockme',
                                    templateUrl: 'tpl/page_lockme.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['toaster', 'ServiceUsers']).then(
                                                        function () {
                                                            return $ocLazyLoad.load('js/controllers/LockmeCtrl.js');
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('access', {
                                    url: '/access',
                                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                                })
                                .state('access.signin', {
                                    url: '/signin',
                                    templateUrl: 'tpl/page_signin.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad', 'uiLoad',
                                            function ($ocLazyLoad, uiLoad) {
                                                return uiLoad.load(['js/controllers/signin.js']
                                                        ).then(
                                                        function () {
                                                            return $ocLazyLoad.load('ServiceUsers');
                                                        }
                                                )
                                            }]
                                    }
                                })

                                .state('access.signup', {
                                    url: '/signup',
                                    templateUrl: 'tpl/page_signup.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad', 'uiLoad',
                                            function ($ocLazyLoad, uiLoad) {
                                                return uiLoad.load(['js/controllers/signup.js']
                                                        ).then(
                                                        function () {
                                                            return $ocLazyLoad.load('ServiceUsers');
                                                        }
                                                )
                                            }]
                                    }
                                })
                                .state('access.forgotpwd', {
                                    url: '/forgotpwd',
                                    templateUrl: 'tpl/page_forgotpwd.html',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/controllers/forgotPass.js']);
                                            }]
                                    }
                                })
                                .state('access.404', {
                                    url: '/404',
                                    templateUrl: 'tpl/page_404.html'
                                })

                                // fullCalendar
                                .state('app.calendar', {
                                    url: '/calendar',
                                    templateUrl: 'tpl/app_calendar.html',
                                    // use resolve to load other dependences
                                    resolve: {
                                        deps: ['$ocLazyLoad', 'uiLoad',
                                            function ($ocLazyLoad, uiLoad) {
                                                return uiLoad.load(
                                                        ['vendor/jquery/fullcalendar/fullcalendar.css',
                                                            'vendor/jquery/fullcalendar/theme.css',
                                                            'vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                                                            'vendor/libs/moment.min.js',
                                                            'vendor/jquery/fullcalendar/fullcalendar.min.js',
                                                            'js/app/calendar/calendar.js']
                                                        ).then(
                                                        function () {
                                                            return $ocLazyLoad.load('ui.calendar');
                                                        }
                                                )
                                            }]
                                    }
                                })

                                // mail
                                .state('app.mail', {
                                    abstract: true,
                                    url: '/mail',
                                    templateUrl: 'tpl/mail.html',
                                    // use resolve to load other dependences
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/app/mail/mail.js',
                                                    'js/app/mail/mail-service.js',
                                                    'vendor/libs/moment.min.js']);
                                            }]
                                    }
                                })
                                .state('app.mail.list', {
                                    url: '/inbox/{fold}',
                                    templateUrl: 'tpl/mail.list.html'
                                })
                                .state('app.mail.detail', {
                                    url: '/{mailId:[0-9]{1,4}}',
                                    templateUrl: 'tpl/mail.detail.html'
                                })
                                .state('app.mail.compose', {
                                    url: '/compose',
                                    templateUrl: 'tpl/mail.new.html'
                                })

                                .state('layout', {
                                    abstract: true,
                                    url: '/layout',
                                    templateUrl: 'tpl/layout.html'
                                })
                                .state('layout.fullwidth', {
                                    url: '/fullwidth',
                                    views: {
                                        '': {
                                            templateUrl: 'tpl/layout_fullwidth.html'
                                        },
                                        'footer': {
                                            templateUrl: 'tpl/layout_footer_fullwidth.html'
                                        }
                                    },
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/controllers/vectormap.js']);
                                            }]
                                    }
                                })
                                .state('layout.mobile', {
                                    url: '/mobile',
                                    views: {
                                        '': {
                                            templateUrl: 'tpl/layout_mobile.html'
                                        },
                                        'footer': {
                                            templateUrl: 'tpl/layout_footer_mobile.html'
                                        }
                                    }
                                })
                                .state('layout.app', {
                                    url: '/app',
                                    views: {
                                        '': {
                                            templateUrl: 'tpl/layout_app.html'
                                        },
                                        'footer': {
                                            templateUrl: 'tpl/layout_footer_fullwidth.html'
                                        }
                                    },
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/controllers/tab.js']);
                                            }]
                                    }
                                })
                                .state('apps', {
                                    abstract: true,
                                    url: '/apps',
                                    templateUrl: 'tpl/layout.html'
                                })
                                .state('apps.note', {
                                    url: '/note',
                                    templateUrl: 'tpl/apps_note.html',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/app/note/note.js',
                                                    'vendor/libs/moment.min.js']);
                                            }]
                                    }
                                })
                                .state('apps.contact', {
                                    url: '/contact',
                                    templateUrl: 'tpl/apps_contact.html',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/app/contact/contact.js']);
                                            }]
                                    }
                                })
                                .state('app.weather', {
                                    url: '/weather',
                                    templateUrl: 'tpl/apps_weather.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(
                                                        {
                                                            name: 'angular-skycons',
                                                            files: ['js/app/weather/skycons.js',
                                                                'vendor/libs/moment.min.js',
                                                                'js/app/weather/angular-skycons.js',
                                                                'js/app/weather/ctrl.js']
                                                        }
                                                );
                                            }]
                                    }
                                })
                                .state('music', {
                                    url: '/music',
                                    templateUrl: 'tpl/music.html',
                                    controller: 'MusicCtrl',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load([
                                                    'com.2fdevs.videogular',
                                                    'com.2fdevs.videogular.plugins.controls',
                                                    'com.2fdevs.videogular.plugins.overlayplay',
                                                    'com.2fdevs.videogular.plugins.poster',
                                                    'com.2fdevs.videogular.plugins.buffering',
                                                    'js/app/music/ctrl.js',
                                                    'js/app/music/theme.css'
                                                ]);
                                            }]
                                    }
                                })
                                .state('music.home', {
                                    url: '/home',
                                    templateUrl: 'tpl/music.home.html'
                                })
                                .state('music.genres', {
                                    url: '/genres',
                                    templateUrl: 'tpl/music.genres.html'
                                })
                                .state('music.detail', {
                                    url: '/detail',
                                    templateUrl: 'tpl/music.detail.html'
                                })
                                .state('music.mtv', {
                                    url: '/mtv',
                                    templateUrl: 'tpl/music.mtv.html'
                                })
                                .state('music.mtvdetail', {
                                    url: '/mtvdetail',
                                    templateUrl: 'tpl/music.mtv.detail.html'
                                })
                                .state('music.playlist', {
                                    url: '/playlist/{fold}',
                                    templateUrl: 'tpl/music.playlist.html'
                                })
                    }
                ]
                );