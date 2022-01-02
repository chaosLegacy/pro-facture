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
                $http.defaults.headers.common['Authorization'] = 'Basic ';
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
                        $state.go('lockme', {}, { location: true });
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
                        $state.go('access.404', {}, { location: false });
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
                                    return $ocLazyLoad.load(['angular-toasty', 'ServiceUtiles', 'ServiceUsers', 'ServiceHistorique']).then(
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


                    .state('app.profile', {
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

            }
        ]
    );