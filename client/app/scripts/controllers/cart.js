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
        if (data.status == 'done')
          cart.updateCart();
        else
          alert ('Stergerea a esuat.');
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
        if (data.status == 'done')
          cart.items = data.cart;
      });
    }

    this.placeOrder = function ()
    {
      $http.post('put_order', {userId: cart.userId}). success (function (data){
        if (data.status == 'done')
          $location.path('done')
        else
          alert ('Comanda nu a putut fi plasata.');
      });
    }

    this.updateCart();

  });

