angular.module('adminApp')
  .controller('AdminLoginController', function ($http, $location) {
  	this.username = null;
  	this.password = null;

  	var admin = this;

  	this.login = function ()
  	{
      console.log(admin.password);
  		$http.post ('login', {username: admin.username, password: admin.password})
  		.success (function (data){
        if (data.status == 'done')
    			if (!data.user || !data.user.admin)
    				alert('Nu aveti drept de administrator');
    			else
    				$location.path('admin_page');
        else
          alert ('Autentificarea a esuat');
  		});
  	}
  });