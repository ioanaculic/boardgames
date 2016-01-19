angular.module('clientApp')
  .controller('UserController', function ($http, $location) {

  	this.create		 = true;
  	this.username 	 = null;
  	this.lastname 	 = null;
  	this.firstname 	 = null;
  	this.address 	 = null;
  	this.phone 		 = null;
  	this,password 	 = null;

  	var user = this;

  	this.change = function ()
  	{
  		this.create = !this.create;
  	}

  	this.login = function ()
  	{
  		$http.post ('login', {username: user.username, password: user.password})
  		.success (function (data){
        if (data.status == 'done')
  			 $location.path ('/'+data.user._id);
        else
           alert ('Autentificarea a esuat!')
		});
  	}

  	this.addUser = function ()
  	{
      if (user.username && user.firstname && user.phone && user.address && user.password)
      {
        console.log(/[0-9]{5}[0-9]+/.test(user.phone));
        if (!(/\+?[0-9]{5}[0-9]+/.test(user.phone)))
          alert ('Numar de telefon incorect')
        else
          $http.post ('add_user', {
          username: user.username,
          name  : user.firstname + ' ' + user.lastname,
          address : user.address,
          phone : user.phone,
          password: user.password
          })
          .success (function (data){
            if (data.status == 'done')
             $location.path ('/'+data.user._id);
            else
              alert ('Va rugam alegeti alt nume de utilizator.');
         });
      }	
      else
        alert ('Va rugam introduceti toate datele')
  	}
  });