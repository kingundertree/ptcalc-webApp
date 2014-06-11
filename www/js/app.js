
// 路由配置
var jsq = angular.module('jsqpage',[]);
jsq.config(function($routeProvider) {
  $routeProvider.
      when('/first', {templateUrl: 'view/nav.html',controller: 'con'}).
      otherwise({redirectTo: '/first'});
});




