angular.module('app')
        .directive('slider', function ($timeout) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    slides: '='
                },
                
                link: function (scope, elem, attrs) {
                    scope.currentIndex = 0;
                    scope.next = function () {
                        scope.currentIndex < scope.slides.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
                    };

                    scope.prev = function () {
                        scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.slides.length - 1;
                    };
                    scope.$watch('currentIndex', function () {
                        scope.slides.forEach(function (astuce) {
                            astuce.visible = false;
                        });
                        scope.slides[scope.currentIndex].visible = true;
                    });
                    /* Start: For Automatic slideshow*/

                    var timer;

                    var sliderFunc = function () {
                        timer = $timeout(function () {
                            scope.next();
                            timer = $timeout(sliderFunc, 5000);
                        }, 5000);
                    };

                    sliderFunc();

                    scope.$on('$destroy', function () {
                        $timeout.cancel(timer);
                    });

                    /* End : For Automatic slideshow*/
                },
                templateUrl: 'tpl/templates/templateurl.html'
            };
        });