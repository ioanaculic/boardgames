angular.module('adminApp')
  .controller('AdminLoginController', function ($http, $location) {
  	this.username = null;
  	this.password = null;

  	var admin = this;

  	this.login = function ()
  	{
      console.log('login');
  		$http.post ('login', {username: admin.username, password: admin.password})
  		.success (function (data){
  			if (!data.user || !data.user.admin)
  				alert('not admin');
  			else
  				$location.path('admin_page');
  		});
  	}
  });