'use strict';

/* Controllers */
// articles controller
app.controller('GesArticlesController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceArticles', '$state', '$stateParams', '$timeout', 'toaster', 'FileUploader', function ($scope, ServiceUtiles, ServiceHistorique, ServiceArticles, $state, $stateParams, $timeout, toaster, FileUploader) {
    var idSociete = $scope.app.user.idSociete;
    var uploader = $scope.uploader = new FileUploader({
        url: 'companies/upload.php',
        formData: [{
            id: (Date.now() + "").substring(4, 15),
            societe: $scope.app.user.societeName,
            section: 'catalogs/products'
        }]
    });
    uploader.onAfterAddingFile = function (item) {
        $scope.article.photo = "companies/" + $scope.app.user.societeName + "/catalogs/products/" + item.formData[0].id + item.file.name;
    };

    ServiceUtiles.getListunits().then(function (data) {
        $scope.Listeunits = data;
    });

    function viderChampsArticle() {
        //get params General devise
        ServiceUtiles.getParamsGenrals(idSociete).then(function (general) {
            $scope.paramsGen = general;
            ServiceUtiles.getListTva().then(function (tva) {
                $scope.ListeTva = tva;
                angular.forEach($scope.ListeTva, function (value) {
                    if ($scope.paramsGen.idDefaultTva === value.idTva) {
                        $scope.article = {
                            idArticle: "",
                            reference: "A-" + $scope.app.user.idUser + (Date.now() + "").substring(4, 15),
                            designation: "",
                            description: "",
                            idCategorie: "",
                            qte: "",
                            prixA: "",
                            prixV: "",
                            idUnite: 1,
                            idTva: value.idTva,
                            idNature: "0",
                            photo: "img/p0.jpg",
                            Oper: 1
                        };

                    }
                });
            });
        });
    }

    function getArticle(idArt) {
        if ((idArt !== "") && (typeof idArt !== 'undefined')) {
            ServiceArticles.getArticle(idArt).then(function (data) {
                $scope.article = {
                    idArticle: data.idArticle,
                    reference: data.reference,
                    designation: data.designation,
                    description: data.description,
                    idCategorie: data.idCategorie,
                    qte: data.qte,
                    prixA: data.prixA,
                    prixV: data.prixV,
                    idUnite: data.idUnite,
                    idTva: data.idTva,
                    idNature: data.idNature,
                    photo: data.photo,
                    Oper: 2
                };
            });
        }
    }

    function notifyBox(title, msg, type) {
        $scope.toaster = {
            type: type,
            title: title,
            text: msg
        };
        toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
    }

    function checkData(article) {
        debugger

        if (article.designation === '') {
            return 'Désignation article obligatoire';
        }

        if (article.prixA === '') {
            if (isNaN(article.prixA)) {
                return "prix d'achat invalide!!!";
            }
            return "prix d'achat obligatoire";
        }

        if (article.prixV === '') {
            if (isNaN(article.prixV)) {
                return 'prix de vente invalide!!!';
            }
            return 'prix de vente obligatoire';
        }


        if (article.idTva === '') {
            return 'Tva obligatoire';
        }

        if (article.idUnite === '') {
            return 'Unité obligatoire';
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

    if (typeof $stateParams.idArt !== 'undefined' && $stateParams.idArt !== '') {
        viderChampsArticle();
        getArticle($stateParams.idArt);
    } else {
        $timeout(function () {
            viderChampsArticle();
        }, 300);
    }

    $scope.back = function () {
        $state.go('app.articles');
    };

    $scope.updateArticle = function (refFour) {
        $state.go('app.gesArticle', { refFour: refFour });
    };

    $scope.saveArticle = function (article) {

        var msg = checkData(article);

        if (msg !== '') {
            notifyBox('Erreur', msg, 'error');
        } else {
            $scope.article.idSociete = idSociete;
            uploader.uploadAll();
            ServiceArticles.saveArticle(article).then(function () {
                if ($scope.article.Oper === 1) {
                    interactHisto($scope.article.reference, 'article', 11, '');
                } else {
                    interactHisto($scope.article.reference, 'article', 12, '');
                }
                notifyBox('Succès', 'Edition Article: ' + article.reference + ' effectué avec succès', 'success');
                $timeout(function () {
                    viderChampsArticle();
                    $state.go('app.articles');
                }, 800);

            });
        }

    };

}]);