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
  			$location.path ('/'+data.user._id);
		});
  	}

  	this.addUser = function ()
  	{
  		$http.post ('add_user', {
  			username: user.username,
  			name	: user.firstname + ' ' + user.lastname,
  			address	: user.address,
  			phone	: user.phone,
  			password: user.password
  		})
  		.success (function (data){
  			$location.path ('/'+data.user._id);
  		});
  	}
  });