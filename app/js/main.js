'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

      var curdate = new Date();
      var spinnerTempate = '<div class="loading-container loader"><div class="loading"><img src="img/spinners/ripple-sm.svg"/></div></div>';

      $('body').append(spinnerTempate);

      // config
      $scope.app = {
        name: 'Pro-facture',
        version: '1.0',
        logo: 'img/ProFacture.png',
        rootDir: '/pro-facture/app/',
        date: curdate,
        // for chart colors
        color: {
          primary: '#7266ba',
          info: '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger: '#f05050',
          light: '#e8eff0',
          dark: '#3a3f51',
          black: '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        },
        user: {
          idUser: "",
          idSociete: "",
          login: "",
          lastLogin: "",
          userName: "",
          societeName: "",
          picture: "",
          mission: "",
          typeAbonnement: "",
          accessToken: "",
          api: "http://localhost/pro-facture/app/api"
        },
        abonnements: {
          standardType: 0,
          businessType: 1,
          premiumType: 2,
          standard: {
            maxClientsCount: 2,
            maxFournisseursCount: 2,
            maxCommandesCount: 10,
            maxFacturesCount: 5
          },
          business: {
            maxClientsCount: 30,
            maxFournisseursCount: 50,
            maxCommandesCount: 70,
            maxFacturesCount: 5
          },
          premium: {
            maxClientsCount: Number.MAX_SAFE_INTEGER,
            maxFournisseursCount: Number.MAX_SAFE_INTEGER,
            maxCommandesCount: Number.MAX_SAFE_INTEGER,
            maxFacturesCount: Number.MAX_SAFE_INTEGER
          }
        }

      };
      // save user to local storage
      if (angular.isDefined($localStorage.user)) {
        $scope.app.user = $localStorage.user;
      } else {
        $localStorage.user = $scope.app.user;
      }

      $scope.$watch('app.user', function () {
        // save to local storage
        $localStorage.user = $scope.app.user;
      }, true);

      // save settings to local storage
      if (angular.isDefined($localStorage.settings)) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }

      $scope.$watch('app.settings', function () {
        if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);


      function isSmartDevice($window) {
        // Adapted from http://www.detectmobilebrowsers.com
        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

    }]);