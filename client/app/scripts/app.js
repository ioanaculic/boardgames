'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
var app = angular.module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
   ])
.config(function ($routeProvider) {
    $routeProvider
      .when ('/cart/:userId', {
        templateUrl: 'views/cart.html'
      })
      .when ('/done', {
        templateUrl: 'views/done.html'
      })
      .when ('/account', {
        templateUrl: 'views/account.html'
      })
      .when ('/admin', {
        templateUrl: 'views/admin_login.html'
      })
      .when ('/admin_page', {
        templateUrl: 'views/admin_page.html'
      })
      .when ('/:userId?', {
        templateUrl: 'views/main.html'
      })
  });
