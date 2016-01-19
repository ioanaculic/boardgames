'use strict'
var express = require ('express'),
	crypto = require ('crypto'),
	db = require ('../db.js'),
  path = require ('path');

var router = express.Router();

/* GET home page. */
router.post('/login', function (req, res, next){
  db.getUserByUsername (req.body.username, function (err, user){
  	if (!err && user)
  	{
  		var hash = crypto.createHash('sha256').update(req.body.password, 'utf8').digest('hex');
  		if (hash == user.password)
  			res.status(200).send({status:'done', user: user});
      else
        res.status(200).send({status:'error'});
  	}
  	else
  		res.status(200).send({status: 'error'});
  });
});

router.post ('/add_user', function (req, res){
  var passHash = crypto.createHash('sha256').update(req.body.password, 'utf8').digest('hex');
  var user = {
    username  : req.body.username,
    name      : req.body.name,
    address   : req.body.address,
    phone     : req.body.phone,
    password  : passHash
  }
  db.addUser (user, function (err, user){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done', user: user});
  });
});

router.post ('/add_item', function (req, res){
  db.addItem (req.body.item, function (err){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done'});
  });
});

router.get ('/get_items', function (req, res){
  db.getItemsByCriteria (null, null, null, function (err, items){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done', items: items});
  });
});

router.post ('/filter', function (req, res){
  db.getItemsByCriteria (req.body.difficulty, req.body.theme, req.body.players, function (err, items){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done', items: items}); 
  });
});

router.post ('/order', function (req, res){
  db.addItemToBasket (req.body.item, req.body.userId, function (err){
    console.log(err);
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done'});
  });
});

router.post ('/remove_item', function (req, res){
  db.removeItem (req.body.itemId, function (err){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done'});
  });
});

router.get ('/get_difficulties', function (req, res){
  res.status (200).send ({status: 'done', difficulties: db.difficulties});
});

router.get ('/get_themes', function (req, res){
  res.status (200).send ({status: 'done', themes: db.themes});
});

router.post ('/get_cart', function (req, res){
  db.getCart (req.body.userId, function (err, cart){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done', cart: cart});
  });
});

router.post ('/remove_cart', function (req, res){
  db.removeItemFromBasket (req.body.userId, req.body.item, function (err){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done'});
  })
});

router.post ('/put_order', function (req, res){
  db.addItemsToBasket (req.body.userId, function (err){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done'});
  });
});

router.get ('/admin', function (req, res){
  res.sendFile (path.join (__dirname+'/../../client/app/admin.html'));
});

router.get ('/get_users', function (req, res){
  db.getUsers (function (err, users){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done', users: users});
  });
});

router.post ('/get_user', function (req, res){
  db.getUser (req.body.userId, function (err, user){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done', user: user});
  });
});

router.post ('/get_item', function (req, res){
  db.getItemByName (req.body.name, function (err, item){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done', item: item});
  })
});

router.post ('/update_item', function (req, res){
  db.updateItem (req.body.item, function (err){
    if (err)
      res.status (200).send ({status: 'error'});
    else
      res.status (200).send ({status: 'done'});
  });
});


module.exports = router;
