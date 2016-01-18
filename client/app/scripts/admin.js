'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
var app = angular.module('adminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
   ])
.config(function ($routeProvider) {
    $routeProvider
      .when ('/admin_page', {
        templateUrl: 'views/admin_page.html'
      })
      .when ('/admin_users', {
        templateUrl: 'views/admin_users.html'
      })
      .otherwise ({
        templateUrl: 'views/admin_login.html'
      })
  });
