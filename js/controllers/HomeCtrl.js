'use strict';

/* Controllers */
// articles controller
app.controller('HomeController', ['$scope', 'ServiceUtiles', function ($scope, ServiceUtiles) {

        var idSociete = $scope.app.user.idSociete;
        var typeAbonement = $scope.app.user.typeAbonnement;
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

        $scope.section = [
            {'id': 1, etat: false},
            {'id': 2, etat: false},
            {'id': 3, etat: false},
            {'id': 4, etat: false}
        ];

        $scope.section[1].etat = true;

        var curDate = new Date();
        var mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

        $scope.curYearDescendant = [];
        for (var i = curDate.getFullYear(); i > curDate.getFullYear() - 5; i--) {
            $scope.curYearDescendant.push({id: i, label: i});
        }//get the last 5 years

        $scope.filterState = {'id': curDate.getFullYear()}; // default trie cur year
        
        function checkTypeAbonnement() {
            if (typeAbonement === $scope.app.abonnements.premiumType) {
                return 1;
            } else {
                return 0;
            }
            return 1;
        }

        function openTab(x) {
            var maxtabsCount = $scope.section.length;
            for (var i = 0; i < maxtabsCount; i++) {
                $scope.section[i].etat = false;

                if (i === x) {
                    $scope.section[i].etat = true;
                }
            }
        }

        $scope.opentab = function (number) {
            openTab(number);
            switch (number) {
                case 1:
                    $scope.filterStatesByDate = function (filterYear) {
                        userAcitivity(filterYear);
                    };
                    userAcitivity($scope.filterState.id);
                    break;

                case 2:
                    if (checkTypeAbonnement() === 1) {
                        $scope.filterStatesByDate = function (filterYear) {
                            performanceCommercial(filterYear);
                        };
                        performanceCommercial($scope.filterState.id);
                    }

                    break;

                case 3:
                    if (checkTypeAbonnement() === 1) {
                        $scope.filterStatesByDate = function (filterYear) {
                            newClients(filterYear);
                        };
                        newClients($scope.filterState.id);
                    }

                    break;
            }
        };

        $scope.filterStatesByDate = function (filterYear) {
            userAcitivity(filterYear);
        };
        userAcitivity($scope.filterState.id);

        function userAcitivity(filterYear) {
            ServiceUtiles.stateClient(idSociete).then(function (data) {
                $scope.countClient = data.countClient;
            });

            ServiceUtiles.stateFournisseur(idSociete).then(function (data) {
                $scope.countFournisseur = data.countFournisseur;
            });

            ServiceUtiles.getInfosFacturesAStats(filterYear, idSociete).then(function (data) {
                $scope.factureData = data;

                $scope.factACount = 0;
                $scope.factA_allStatus_total = 0;

                $scope.factA_tt_encours = 0;
                $scope.factA_count_encours = 0;

                $scope.factA_tt_enRetard = 0;
                $scope.factA_count_enRetard = 0;

                $scope.factA_tt_cloture = 0;
                $scope.factA_count_cloture = 0;

                $scope.factA_tt_valide = 0;
                $scope.factA_count_valide = 0;

                angular.forEach($scope.factureData, function (value) {
                    if (value.idEtat !== 4) {
                        $scope.factACount += value.factACount;
                        $scope.factA_allStatus_total += value.status_Total;
                        if (value.idEtat === 0) {
                            $scope.factA_tt_encours = value.status_Total;
                            $scope.factA_count_encours = value.factACount;
                        } else if (value.idEtat === 1) {
                            $scope.factA_tt_enRetard = value.status_Total;
                            $scope.factA_count_enRetard = value.factACount;
                        } else if (value.idEtat === 2) {
                            $scope.factA_tt_cloture = value.status_Total;
                            $scope.factA_count_cloture = value.factACount;
                        } else if (value.idEtat === 3) {
                            $scope.factA_tt_valide = value.status_Total;
                            $scope.factA_count_valide = value.factACount;
                        }
                    }
                });
            });
            
            ServiceUtiles.getInfosFacturesVStats(filterYear, idSociete).then(function (data) {
                $scope.factureData = data;

                $scope.factVCount = 0;
                $scope.factV_allStatus_total = 0;

                $scope.factV_tt_encours = 0;
                $scope.factV_count_encours = 0;

                $scope.factV_tt_enRetard = 0;
                $scope.factV_count_enRetard = 0;

                $scope.factV_tt_cloture = 0;
                $scope.factV_count_cloture = 0;

                $scope.factV_tt_valide = 0;
                $scope.factV_count_valide = 0;

                angular.forEach($scope.factureData, function (value) {
                    if (value.idEtat !== 4) {
                        $scope.factVCount += value.factVCount;
                        $scope.factV_allStatus_total += value.status_Total;
                        if (value.idEtat === 0) {
                            $scope.factV_tt_encours = value.status_Total;
                            $scope.factV_count_encours = value.factVCount;
                        } else if (value.idEtat === 1) {
                            $scope.factV_tt_enRetard = value.status_Total;
                            $scope.factV_count_enRetard = value.factVCount;
                        } else if (value.idEtat === 2) {
                            $scope.factV_tt_cloture = value.status_Total;
                            $scope.factV_count_cloture = value.factVCount;
                        } else if (value.idEtat === 3) {
                            $scope.factV_tt_valide = value.status_Total;
                            $scope.factV_count_valide = value.factVCount;
                        }
                    }
                });
            });
            
            
            ServiceUtiles.getRevenuPaiementOnFAByYear(filterYear, idSociete).then(function(data){
                $scope.tottalRevenueAchat = data.totalPAchat;
            });
            
            ServiceUtiles.getRevenuPaiementOnFVByYear(filterYear, idSociete).then(function(data){
                $scope.tottalRevenueVente = data.totalPvente;
            });
            
            // get all depenses & factures total by year
            ServiceUtiles.getAllFacturesVentesByYear(filterYear, idSociete).then(function (factData) {
                ServiceUtiles.getAllFacturesAchatsByYear(filterYear, idSociete).then(function (depData) {
                    $scope.fact_data = factData;
                    $scope.dep_data = depData;

                    //var chart;
                    nv.addGraph(function () {
                        var chart = nv.models.multiBarHorizontalChart()
                                .x(function (d) {
                                    return d.label;
                                })
                                .y(function (d) {
                                    return d.value;
                                })
                                .duration(350)
                                .showValues(true)
                                .stacked(true)
                                .showControls(true);

                        chart.yAxis.tickFormat(d3.format(',.2f'));
                        chart.yAxis.axisLabel('Montant ' + '(' + $scope.currency + ')');
                        chart.xAxis.axisLabel('').axisLabelDistance(20);
                        chart.margin().left = 80;
                        chart.margin().right = 40;

                        d3.select('#chart1 svg')
                                .datum(data())
                                .call(chart);

                        nv.utils.windowResize(chart.update);
                        chart.dispatch.on('stateChange', function (e) {
                            nv.log('New State:', JSON.stringify(e));
                        });
                        chart.state.dispatch.on('change', function (state) {
                            nv.log('state', JSON.stringify(state));
                        });
                        return chart;
                    });

                    function data() {
                        var evolutionDep = [], evolutionFact = [];

                        var depenseCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        var factureCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                        angular.forEach($scope.fact_data, function (facture) {
                            var dateCreation = new Date(facture.dateCre.substr(0, facture.dateCre.indexOf(' ')));
                            var mounth = dateCreation.getMonth() + 1;
                            for (var i = 0; i < mois.length; i++) {
                                if (i === mounth - 1) {
                                    factureCount[i] += facture.total;
                                }
                            }
                        });

                        angular.forEach($scope.dep_data, function (depense) {

                            var dateCreation = new Date(depense.dateCre.substr(0, depense.dateCre.indexOf(' ')));
                            var mounth = dateCreation.getMonth() + 1;
                            for (var i = 0; i < mois.length; i++) {
                                if (i === mounth - 1) {
                                    depenseCount[i] += depense.total * (-1);
                                }
                            }
                        });

                        for (var i = 0; i < mois.length; i++) {
                            evolutionDep.push({label: mois[i], value: depenseCount[i]});
                            evolutionFact.push({label: mois[i], value: factureCount[i]});
                        }

                        return [
                            {
                                values: evolutionDep,
                                key: 'Dépenses',
                                color: '#d62728'
                            },
                            {
                                values: evolutionFact,
                                key: 'Chiffre d\'affaire',
                                color: '#1f77b4'
                            }
                        ];

                    }

                });

            });
        }

        function performanceCommercial(filterYear) {
            ServiceUtiles.getAllFacturesVentesByYear(filterYear, idSociete).then(function (factData) {
                ServiceUtiles.getAllFacturesAchatsByYear(filterYear, idSociete).then(function (devData) {
                    $scope.fact_data = factData;
                    $scope.dev_data = devData;

                    nv.addGraph(function () {
                        var chart = nv.models.multiBarHorizontalChart()
                                .x(function (d) {
                                    return d.label;
                                })
                                .y(function (d) {
                                    return d.value;
                                })
                                .duration(350)
                                .showValues(true)
                                .stacked(false)
                                .showControls(true);

                        chart.yAxis.tickFormat(d3.format(',.2f'));
                        chart.yAxis.axisLabel('Montant ' + '(' + $scope.currency + ')');
                        chart.xAxis.axisLabel('').axisLabelDistance(20);
                        chart.margin().left = 80;
                        chart.margin().right = 40;


                        d3.select('#chartPerCom svg')
                                .datum(data())
                                .call(chart);

                        nv.utils.windowResize(chart.update);

                        chart.dispatch.on('stateChange', function (e) {
                            nv.log('New State:', JSON.stringify(e));
                        });
                        chart.state.dispatch.on('change', function (state) {
                            nv.log('state', JSON.stringify(state));
                        });
                        return chart;
                    });

                    function data() {
                        var evolutionDev = [], evolutionFact = [];

                        var devisCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        var factureCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                        angular.forEach($scope.fact_data, function (facture) {
                            var dateCreation = new Date(facture.dateCre.substr(0, facture.dateCre.indexOf(' ')));
                            var mounth = dateCreation.getMonth() + 1;
                            var year = dateCreation.getFullYear();
                            for (var i = 0; i < mois.length; i++) {
                                if (i === mounth - 1 && year === filterYear) {
                                    factureCount[i] += 1;
                                }
                            }
                        });

                        angular.forEach($scope.dev_data, function (devis) {
                            var dateCreation = new Date(devis.dateCre.substr(0, devis.dateCre.indexOf(' ')));
                            var mounth = dateCreation.getMonth() + 1;
                            var year = dateCreation.getFullYear();
                            for (var i = 0; i < mois.length; i++) {
                                if (i === mounth - 1 && year === filterYear) {
                                    devisCount[i] += 1;
                                }
                            }
                        });

                        for (var i = 0; i < mois.length; i++) {
                            evolutionDev.push({label: mois[i], value: devisCount[i]});
                            evolutionFact.push({label: mois[i], value: factureCount[i]});
                        }

                        return [
                            {
                                values: evolutionDev,
                                key: 'Factures achats',
                                color: '#ff7f0e'
                            },
                            {
                                values: evolutionFact,
                                key: 'Factures ventes',
                                color: '#2ca02c'
                            }
                        ];

                    }
                });
            });
        }

        function newClients(filterYear) {
            ServiceUtiles.getClientsNvFactures(filterYear, idSociete).then(function (allFact) {
                

                $scope.listeFactsPerClient = allFact;

                nv.addGraph(function () {
                    var chart = nv.models.multiBarHorizontalChart()
                            .x(function (d) {
                                return d.label;
                            })
                            .y(function (d) {
                                return d.value;
                            })
                            .duration(350)
                            .showValues(true)
                            .stacked(true)
                            .showControls(false);

                    chart.yAxis.tickFormat(d3.format(',.0d'));
                    chart.yAxis.axisLabel('N° des nouveaux clients');
                    chart.xAxis.axisLabel('').axisLabelDistance(20);
                    chart.margin().left = 80;
                    chart.margin().right = 40;

                    d3.select('#chartClients svg')
                            .datum(data())
                            .call(chart);

                    nv.utils.windowResize(chart.update);
                    chart.dispatch.on('stateChange', function (e) {
                        nv.log('New State:', JSON.stringify(e));
                    });
                    chart.state.dispatch.on('change', function (state) {
                        nv.log('state', JSON.stringify(state));
                    });
                    return chart;
                });

                function data() {
                    var evolutionNvCLient = [];
                    var nvCLients = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                    angular.forEach($scope.listeFactsPerClient, function (facture) {
                        var dateCreation = new Date(facture.dateFirstFacture.substr(0, facture.dateFirstFacture.indexOf(' ')));
                        var mounth = dateCreation.getMonth() + 1;
                        var year = dateCreation.getFullYear();

                        if (facture.dateMin !== "0") {
                            for (var i = 0; i < mois.length; i++) {
                                if (i === mounth - 1 && year === filterYear) {
                                    nvCLients[i] += 1;
                                }
                            }
                        }

                    });


                    for (var i = 0; i < mois.length; i++) {
                        evolutionNvCLient.push({label: mois[i], value: nvCLients[i]});
                    }

                    return [
                        {
                            values: evolutionNvCLient,
                            key: 'Nouveau client',
                            color: '#605CA8'
                        }
                    ];

                }

            });
        }

    }]);