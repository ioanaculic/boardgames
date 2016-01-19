angular.module('adminApp')
  .controller('AdminController', function ($scope, $http, $location, $window) {
  	
    this.gameName           = null;
    this.difficulties       = [];
    this.themes             = [];
    this.selectedDifficulty = null;
    this.selectedTheme1     = null;
    this.selectedTheme2     = null;
    this.selectedTheme3     = null;
    this.minPlayers         = null;
    this.maxPlayers         = null;
    this.price              = null;

  	var admin = this;

    $http.get ('get_difficulties'). success (function (data){
      if (data.status == 'done')
        admin.difficulties = data.difficulties;
    });

    $http.get ('get_themes'). success (function (data){
      if (data.status == 'done')
        admin.themes = data.themes;
    });

    this.add = function ()
    {

      var theme = [];
      if (admin.selectedTheme1)
        theme.push (admin.selectedTheme1);
      if (admin.selectedTheme2)
        theme.push (admin.selectedTheme2);
      if (admin.selectedTheme3)
        theme.push (admin.selectedTheme3);
      var game = {
                  name      : admin.gameName,
                  difficulty: admin.selectedDifficulty,
                  minPlayers: parseInt (admin.minPlayers),
                  maxPlayers: parseInt (admin.maxPlayers),
                  theme     : theme,
                  price     : parseInt (admin.price),
                  quantity  : admin.quantity
      };

      $http.post ('add_item', {item:game}). success (function (data){
        if (data.status == 'done')
        {
          alert ('Joc adaugat');
          $window.location.reload();
        }
        else
          alert ('Jocul nu a putut fi adaugat');
      });
    }
  });