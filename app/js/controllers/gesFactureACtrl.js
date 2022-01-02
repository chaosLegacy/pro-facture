'use strict';
/* Controllers */
// articles controller
app.controller('GesFactureAController', ['$scope', 'ServiceUtiles', 'ServiceHistorique', 'ServiceFacture', 'ServiceFournisseurs', 'ServiceCommande', '$state', '$stateParams', '$timeout', '$filter', '$localStorage', '$modal', 'toaster', 'FileUploader', function ($scope, ServiceUtiles, ServiceHistorique, ServiceFacture, ServiceFournisseurs, ServiceCommande, $state, $stateParams, $timeout, $filter, $localStorage, $modal, toaster, FileUploader) {
        var idSociete = $scope.app.user.idSociete;
        var typeAbonement = $scope.app.user.typeAbonnement;
        var myAbonnement = abonnementChecker(typeAbonement);
        var uploader = $scope.uploader = new FileUploader({
            url: 'companies/upload.php',
            formData: [{
                    id: (Date.now() + "").substring(4, 15),
                    societe: $scope.app.user.societeName,
                    section: 'docs/achats/facture'
                }]
        });
        uploader.onAfterAddingFile = function (item) {
            $scope.facture.attachement = "companies/" + $scope.app.user.societeName + "/docs/achats/facture/" + item.formData[0].id + item.file.name;
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

        function abonnementChecker(type) {
            var abonnement = null;
            switch (type) {
                case 0:
                    abonnement = $scope.app.abonnements.standard;
                    break;
                case 1:
                    abonnement = $scope.app.abonnements.business;
                    break;
                case 2:
                    abonnement = $scope.app.abonnements.premium;
                    break;
            }
            return abonnement;
        }

        function viderChampsFacture() {
            $scope.facture = {
                idFacture: "",
                reference: "FA-" + $scope.app.user.idUser + (Date.now() + "").substring(4, 15),
                dateCre: $filter("date")(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                description: "",
                totalallht: 0,
                attachement: '',
                status: 0,
                Oper: 1
            };
            $scope.commande = {
                ListeElements: []
            };
        }

        function getFacture(idFact) {
            if ((idFact !== "") && (typeof idFact !== 'undefined')) {
                ServiceFacture.getFactureAchat(idFact).then(function (data) {
                    if (data !== "") {
                        $scope.facture = {
                            idFacture: data.idFacture,
                            idCommande: data.idCommande,
                            reference: data.reference,
                            dateCre: $filter("date")(new Date(data.date), 'yyyy-MM-dd hh:mm:ss'),
                            description: data.description,
                            attachement: data.attachement,
                            totalallht: data.total,
                            status: data.idEtat,
                            Oper: 2
                        };

                        getCommande($scope.facture.idCommande);
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

        function checkData(facture) {
            if (facture.reference === '' || typeof (facture.reference) === "undefined") {
                return 'Reference obligatoire';
            }
            if (facture.dateCre === '' || typeof (facture.dateCre) === "undefined") {
                return 'Date obligatoire';
            }
            if ($scope.commande.ListeElements.length <= 0) {
                return 'La facture doit contenir au moins une commande';
            }
            ;
            return "";
        }

        if (typeof $stateParams.idFact !== 'undefined' && $stateParams.idFact !== '') {
            viderChampsFacture();
            getFacture($stateParams.idFact);
        } else {
            viderChampsFacture();
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

        $scope.back = function () {
            $state.go('app.factureAchat');
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

        $scope.saveFactureAchat = function (facture) {
            ServiceFacture.countFacture(idSociete).then(function (data) {
                if (data.countFacture >= myAbonnement.maxFacturesCount && facture.Oper === 1) {
                    notifyBox("Erreur", "Vous avez atteint la limite de " + myAbonnement.maxFacturesCount + " fiches factures.\n Abonnez vous pour enlever cette limite.", 'warning');
                } else {
                    var msg = checkData(facture);
                    if (msg !== '') {
                        notifyBox('Erreur', msg, 'error');
                    } else {
                        $scope.facture.idSociete = idSociete;
                        $scope.facture.idCommande = $scope.commande.idCommande;
                        $scope.facture.totalallht = $scope.commande.totalallht;
                        $scope.facture.dateCre = $filter("date")(new Date($scope.facture.dateCre), 'yyyy-MM-dd hh:mm:ss');
                        uploader.uploadAll();
                        ServiceFacture.saveFactureAchat(facture).then(function () {
                            if (facture.Oper === 1) {
                                interactHisto(facture.reference, 'factureAchat', 30, '');
                                interactHisto($scope.commande.reference, 'commandeAchat', 24, '');
                            } else {
                                interactHisto(facture.reference, 'factureAchat', 31, '');
                            }
                            notifyBox('Succès', 'Edition Facture Achat: ' + facture.reference + ' effectué avec succès', 'success');
                            $timeout(function () {
                                viderChampsFacture();
                                $state.go('app.factureAchat');
                            }, 800);
                        });
                    }
                }
            });
        };
    }]);