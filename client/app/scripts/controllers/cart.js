'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('CartController', function ($http, $location, $routeParams) {

    this.items = [];
    this.userId = $routeParams.userId;

    var cart = this;

    this.remove = function (item)
    {
      $http.post ('remove_cart', {userId: cart.userId, item: item}).success (function (data){
        cart.updateCart();
      });
    }

    this.getTotalCart = function ()
    {
      var total = 0;
      for (var i=0; i<cart.items.length; i++)
      {
        total = total + cart.items[i].price * cart.items[i].quantity;
      }
      return total;
    }

    this.updateCart = function ()
    {
      $http.post ('get_cart', {userId: cart.userId}). success (function (data){
        cart.items = data.cart;
      });
    }

    this.placeOrder = function ()
    {
      console.log('order');
      $http.post('put_order', {userId: cart.userId}). success (function (data){
        $location.path('done')
      });
    }

    this.updateCart();

  });

