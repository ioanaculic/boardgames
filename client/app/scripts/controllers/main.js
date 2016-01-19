'use strict';

angular.module('clientApp')
  .controller('MainController', function ($http, $location, $routeParams) {

  	this.difficulties = [];
  	this.themes = [];
  	this.players = [{name:'1', id: 1}, {name: '2', id: 2}, {name: '3', id: 3}, {name: '4+', id:4}];
    this.cart = [];
    this.items = [];

    this.selectedDifficulty = null;
    this.selectedTheme = null;
    this.selectedPlayer = null;
    this.userName = null;

    var store = this;

    this.userId = $routeParams.userId;

    this.hasUser = function ()
    {
      if (store.userId)
        return true;
      else
      return false;
    }

    this.updateCart = function ()
    {
      if (store.userId)
        $http.post ('get_cart', {userId: store.userId}). success (function (data){
          if (data.status == 'done')
            store.cart = data.cart;
        });
    }

    this.addToCart = function (item)
    {
      if (!store.userId)
      {
        $location.path('account');
      }
      else
      {
        var quantity = 1;
        for (var i=0; i<store.cart.length; i++)
        {
          if (store.cart[i]._id == item._id)
          {
            quantity = store.cart[i].quantity + 1;
            break;
          }
        }

        var item = {name: item.name,
                    price: item.price,
                    quantity: quantity,
                    _id: item._id};
        $http.post ('order', {item: item, userId: store.userId}).success (function (data){
          if (data.status == 'done')
            store.updateCart();
          else
            alert ('Produsul nu a putut fi adaugat in cos.');
        });
      }
    }

    this.remove = function (item)
    {
      $http.post ('remove_cart', {userId: store.userId, item: item}).success (function (data){
        if (data.status == 'done')
          store.updateCart();
        else
          alert ('Produsul nu a putut fi sters din cos.');
      });
    }

    this.getTotalCart = function ()
    {
      var total = 0;
      for (var i=0; i<store.cart.length; i++)
      {
        total = total + store.cart[i].price * store.cart[i].quantity;
      }
      return total;
    }

    this.filter = function ()
    {
      var filer = {difficulty : store.selectedDifficulty,
                   theme      : store.selectedTheme};
      if (store.selectedPlayer)
        filer.players = store.selectedPlayer.id;
      $http.post ('filter', filter)
                  .success (function (data){
                    store.items = data.items;
                  });
    }

  	this.getDifficultyLabel = function (difficulty)
  	{
  		if (difficulty === 'easy')
  			return 'label label-success';
  		else if (difficulty === 'medium')
  			return 'label label-info';
  		else
  			return 'label label-warning';
  	}

    //initialisations

    $http.get ('get_items').success (function (data){
      store.items = data.items;
    });

    $http.get ('get_difficulties'). success (function (data){
      store.difficulties = data.difficulties;
    });

    $http.get ('get_themes'). success (function (data){
      store.themes = data.themes;
    });

    if (this.userId)
    {
      $http.post ('get_user', {userId: this.userId}). success (function (data){
        store.userName = data.user.name;
      });
    }

    this.updateCart();

  });

