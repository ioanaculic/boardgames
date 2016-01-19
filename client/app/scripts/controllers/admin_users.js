angular.module('adminApp')
  .controller('AdminUsersController', function ($scope, $http, $location, $window) {
  	
      this.users = [];

      var admin = this;

      $http.get ('get_users'). success (function (data){
      	if (data.status == 'done')
        	admin.users = data.users;
      });
  });