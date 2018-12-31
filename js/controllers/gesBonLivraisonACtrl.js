'use strict';
/* Controllers */
// articles controller
app.controller('GesBonLivraisonAController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceBonLivraison', 'ServiceFournisseurs', 'ServiceCommande', '$state', '$stateParams', '$timeout', '$filter', '$localStorage', '$modal', 'toaster', 'FileUploader', function ($scope, ServiceUtiles, ServiceHistorique, ServiceBonLivraison, ServiceFournisseurs, ServiceCommande, $state, $stateParams, $timeout, $filter, $localStorage, $modal, toaster, FileUploader) {
        var idSociete = $scope.app.user.idSociete;
        var uploader = $scope.uploader = new FileUploader({
            url: 'companies/upload.php',
            formData: [{
             id: (Date.now() + "").substring(4, 15),
             societe: $scope.app.user.societeName,
             section: 'docs/achats/bonLivraison'
           }]
        });
        uploader.onAfterAddingFile = function (item) {
            $scope.bonLivraison.attachement = "companies/" + $scope.app.user.societeName + "/docs/achats/bonLivraison/" + item.formData[0].id + item.file.name;
        };
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
        ServiceUtiles.getListunits().then(function (data) {
            $scope.ListeUnits = data;
        });
        ServiceUtiles.getListTva().then(function (data) {
            $scope.ListeTva = data;
        });
        ServiceFournisseurs.getListeFouenisseurs(idSociete).then(function (data) {
            $scope.ListeFournisseurs = data;
        });

        ServiceCommande.getListeCommandeAchatEnCours(idSociete).then(function (data) {
            ServiceFournisseurs.getListeFouenisseurs(idSociete).then(function (fournisseurs) {
                $scope.ListeCommandes = data;
                $scope.ListeFournisseurs = fournisseurs;
                angular.forEach($scope.ListeCommandes, function (commande) {
                    angular.forEach($scope.ListeFournisseurs, function (fournisseur) {
                        if (commande.idFournisseur === fournisseur.idFournisseur) {
                            commande.fournisseur = fournisseur.nom;
                        }
                    });
                    commande.isChecked = false;
                });
            });
        });

        $scope.dateCre = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedCre = true;
        };
        function viderChampsBonLivraison() {
            $scope.bonLivraison = {
                idBonLivraison: "",
                reference: "BL-" + $scope.app.user.idUser + (Date.now() + "").substring(4, 15),
                dateCre: $filter("date")(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                description: "",
                totalallht: 0,
                attachement: '',
                Oper: 1
            };
            $scope.commande = {
                ListeElements: []
            };
        }

        function getBonLivraison(idBL) {
            if ((idBL !== "") && (typeof idBL !== 'undefined')) {
                ServiceBonLivraison.getBonLivraisonAchat(idBL).then(function (data) {
                    if (data !== "") {
                        $scope.bonLivraison = {
                            idBonLivraison: data.idBonLivraison,
                            idCommande: data.idCommande,
                            reference: data.reference,
                            dateCre: $filter("date")(new Date(data.date), 'yyyy-MM-dd hh:mm:ss'),
                            description: data.description,
                            attachement: data.attachement,
                            totalallht: data.total,
                            Oper: 2
                        };
                        
                        getCommande($scope.bonLivraison.idCommande);
                    }
                });
            }
        }

        function getCommande(idComm) {
            if ((idComm !== "") && (typeof idComm !== 'undefined')) {
                ServiceCommande.geCommandeAchat(idComm).then(function (data) {
                    if (data !== "") {
                        angular.forEach(data.listeElments, function (element) {

                            angular.forEach($scope.ListeTva, function (tva) {
                                if (element.idTva === tva.idTva) {
                                    element.tva = tva.valeur;
                                }
                            });

                            angular.forEach($scope.ListeUnits, function (unite) {
                                if (element.idUnite === unite.idUnite) {
                                    element.unite = unite.label;
                                }
                            });

                        });
                        
                        angular.forEach($scope.ListeFournisseurs, function (fournisseur) {
                            if (data.idFournisseur === fournisseur.idFournisseur) {
                                data.fournisseur = fournisseur.nom;
                            }
                        });
                        
                        $scope.commande = {
                            idCommande: data.idCommAchat,
                            reference: data.referenceCom,
                            dateCre: $filter("date")(new Date(data.date), 'yyyy-MM-dd'),
                            fournisseur: data.fournisseur,
                            ListeElements: data.listeElments,
                            totalallht: data.total,
                            status: data.idEtat,
                            Oper: 2
                        };
                    }
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

        function checkData(bonLivraison) {
            if (bonLivraison.reference === '' || typeof (bonLivraison.reference) === "undefined") {
                return 'Reference obligatoire';
            }
            if (bonLivraison.dateCre === '' || typeof (bonLivraison.dateCre) === "undefined") {
                return 'Date obligatoire';
            }
            if ($scope.commande.ListeElements.length <= 0) {
                return 'La bon de livraison doit contenir au moins une commande à validé';
            }
            ;
            return "";
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
        
        if (typeof $stateParams.idBL !== 'undefined' && $stateParams.idBL !== '') {
            viderChampsBonLivraison();
            getBonLivraison($stateParams.idBL);
        } else {
            viderChampsBonLivraison();
        }

        $scope.back = function () {
            $state.go('app.bonLivraisonAchat');
        };
        $scope.addCommande = function () {
            $modal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'monTemplate.tpl.html',
                controller: ['$scope', '$modalInstance', 'scopeParent', 'data',
                    function ($scope, $modalInstance, scopeParent, data) {
                        $scope.currency = scopeParent.currency;
                        $scope.ListeCommandes = data;
                        $scope.getCommande = function () {
                            angular.forEach(data, function (commande) {
                                if (commande.isChecked) {
                                    scopeParent.commande.ListeElements.push(commande);
                                    commande.isChecked = false;
                                    scopeParent.commande = [];
                                    getCommande(commande.idCommAchat);
                                }
                            });
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
                    data: function () {
                        return $scope.ListeCommandes;
                    }
                }
            });
        };

        $scope.saveBonLivraisonAchat = function (bonLivraison) {
            
            var msg = checkData(bonLivraison);
            if (msg !== '')
            {
                notifyBox('Erreur', msg, 'error');
            } else
            {
                $scope.bonLivraison.idSociete = idSociete;
                $scope.bonLivraison.idCommande = $scope.commande.idCommande;
                $scope.bonLivraison.totalallht = $scope.commande.totalallht;
                $scope.bonLivraison.dateCre = $filter("date")(new Date($scope.bonLivraison.dateCre), 'yyyy-MM-dd hh:mm:ss');
                uploader.uploadAll();
                ServiceBonLivraison.saveBonLivraisonAchat(bonLivraison).then(function () {
                    if (bonLivraison.Oper === 1) {
                        interactHisto(bonLivraison.reference, 'bonLivraisonAchat', 41, $scope.commande.reference);
                        interactHisto($scope.commande.reference, 'commandeAchat', 25, '');
                        angular.forEach($scope.commande.ListeElements, function(element){
                            interactHisto(element.reference, 'stock', 18, element.qte+" "+element.unite);
                        });
                    } else {
                        interactHisto(bonLivraison.reference, 'bonLivraisonAchat', 42, $scope.commande.reference);
                    }
                    notifyBox('Succès', 'Edition BonLivraison Achat: ' + bonLivraison.reference + ' effectué avec succès', 'success');
                    $timeout(function () {
                        viderChampsBonLivraison();
                        $state.go('app.bonLivraisonAchat');
                    }, 800);
                });
            }

        };
    }]);