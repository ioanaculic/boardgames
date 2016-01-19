angular.module('adminApp')
  .controller('AdminSearchController', function ($http, $location) {
  	this.gameName = null;
    this.itemName = null;
    this.price = null;
    this.selectedDificulty = null;
    this.item = null;
    this.found=false;

  	var search = this;

    $http.get ('get_difficulties'). success (function (data){
      search.difficulties = data.difficulties;
    });

    $http.get ('get_themes'). success (function (data){
      search.themes = data.themes;
    });

  	this.search = function ()
  	{
  		$http.post ('get_item', {name: search.itemName})
  		.success (function (data){
        if (data.status == 'done')
    			if (data.item)
          {
            
            var item = data.item;
    				search.found = true;
            search.item = item;
            search.gameName = item.name;
            search.price = item.price;
            search.quantity = item.quantity;
            search.selectedDifficulty = item.difficulty;
            search.selectedTheme1 = item.theme[0];
            if (item.theme[1])
              search.selectedTheme2 = item.theme[1];
            if (item.theme[2])
              search.selectedTheme2 = item.theme[2];
            search.minPlayers = item.minPlayers;
            search.maxPlayers = item.maxPlayers;
          }
    			else
    				alert ('Nu s-a gasit produsul.')
        else
          alert ('Nu s-a gasit produsul.');
  		});
  	}

    this.edit = function ()
    {
      var theme = [];
      if (search.selectedTheme1)
        theme.push (search.selectedTheme1);
      if (search.selectedTheme2)
        theme.push (search.selectedTheme2);
      if (search.selectedTheme3)
        theme.push (search.selectedTheme3);
      var item = {
                  _id       : search.item._id,
                  name      : search.gameName,
                  difficulty: search.selectedDifficulty,
                  minPlayers: parseInt (search.minPlayers),
                  maxPlayers: parseInt (search.maxPlayers),
                  theme     : theme,
                  price     : parseInt (search.price),
                  quantity  : search.quantity
      };

      $http.post ('update_item', {item: item}). success (function (data){
        if (data.status == 'done')
        {
          alert ('Produs modificat');
          $location.path('admin_page');
        }
        else
          alert ('Produsul nu a putut fi modificat');
      });
    }

    this.delete = function ()
    {
      $http.post ('remove_item', {itemId: search.item._id}). success (function (data){
        if (data.status == 'done')
        {
          alert ('Produs sters');
          $location.path('admin_page');
        }
        else
          alert ('Produsul nu a putut fi sters');
      });
    }
  });