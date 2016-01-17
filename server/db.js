'use strict'

var mongoose = require ('mongoose');
var crypto = require('crypto');
var debug = require ('debug') ('store:db');

var URL = 'mongodb://admin:store@ds031213.mongolab.com:31213/store';
//ioana 
//f00d0rder

var difficulties = ['Easy', 'Medium', 'Hard'];
var themes = ['Action', 'Animals', 'Adventure', 'Racing', 'Fantasy', 'Sport', 'Funny'];

var userSchema = mongoose.Schema ({
	_id: {type: mongoose.Schema.Types.ObjectId, default: function () { return new mongoose.Types.ObjectId()}},
	username: {type: String, unique: true},
	password: String,
	name: String,
	address: String,
	phone: String,
	cart: [{
		name: String,
		price: Number,
		quantity: Number,
		_id: mongoose.Schema.Types.ObjectId
	}],
	items: [{
		name: String,
		price: Number,
		quantity: Number,
		_id: mongoose.Schema.Types.ObjectId
	}]
});

var itemSchema = mongoose.Schema ({
	_id: {type: mongoose.Schema.Types.ObjectId, default: function () { return new mongoose.Types.ObjectId()}},
	name: String,
	description: String,
	difficulty: {type: String, enum: difficulties},
	minPlayers: Number,
	maxPlayers: Number,
	theme: [{type: String, enum: themes}],
	price: Number,
	quantity:{type: Number, default: function () {return 10}}
});

var User = mongoose.model ('User', userSchema);
var Item = mongoose.model ('Item', itemSchema);


function getUser (username, cb)
{
	User.findOne ({username: username}, function (err, doc){
		if (err)
			debug ('Cannot get user with username '+username+' '+err);
		cb (err, doc);
	});
}

function addUser (user, cb)
{
	user.items = [];
	user.cart = [];
	var dbUser = new User (user);
	dbUser.save (function (err, user){
		if (err)
			debug ('Cannot add user '+err);
		cb (err, user);
	});
}

function addItem (item, cb)
{
	var dbItem = new Item (item);
	dbItem.save (function (err){
		if (err)
			debug ('Cannot add item '+err);
		cb (err);
	});
}

function getItemById (itemId, cb)
{
	Item.findOne ({_id: itemId}, function (err, doc){
		if (err)
			debug ('Cannot get item with id: ' + itemId + ' ' + err);
		cb (err, doc);
	});
}

function getItemByName (itemName, cb)
{
	Item.findOne ({name: itemName}, function (err, doc){
		if (err)
			debug ('Cannot get item with name: ' + itemName + ' ' + err);
		cb (err, doc);
	});
}

function getItemByCriteria (itemDifficulty, itemTheme, noPlayers, cb)
{
	var criteria = {};
	if (itemDifficulty)
		criteria.difficulty = itemDifficulty;
	if (itemTheme)
		criteria.theme = itemTheme;
	if (noPlayers)
	{
		criteria.minPlayers = {$lte: noPlayers};
		criteria.maxPlayers = {$gte: noPlayers};
	}

	Item.find (criteria, function (err, doc){
		if (err)
			debug ('Cannot get item with criteria: ' + JSON.stringify (criteria) + ' ' + err);
		cb (err, doc);
	});
}

function addItemToBasket (item, userId, cb)
{
	User.update ({_id: userId, 'items._id': item._id},
		{$set: {'items.$.quantity':item.quantity}}, function (err, affected){
			
			if (err)
			{
				debug ('Cannot update item with id: ' + JSON.stringify(item) + ' ' + err);
				cb (err);
			}
			else
			{
				if (affected.nModified == 0)
				{
					User.findByIdAndUpdate (userId, {$addToSet: {items: item}}, function (err){
						if (err)
							debug ('Cannot add items to user ' + err);
					cb (err);
					});
				}
				else
					cb (err);
			}		
	});
}

function removeItemFromBasket (userId, item, cb)
{
	User.update ({_id: userId}, {'$pull': {items: {_id: item._id}}}, function (err){
		if (err)
			debug ('Cannot remove item ' + item._id + ' from user ' + userId + ' cart ' + err);
		cb (err);
	});
}

function getCart (userId, cb)
{
	User.findOne ({_id: userId}, function (err, user){
		if (err)
		{
			debug ('Cannot get user with id: ' + userId + ' ' + err);
			cb (err);
		}
		else
			cb (err, user.items);
	});
}

function addItemsToBasket (userId, cb)
{
	User.findOne ({_id: userId}, function (err, user){
		if (err)
		{
			debug ('Cannot find user '+err);
			cb (err);
		}
		else
		{
			User.update({_id: userId}, {'$pushAll': {cart: user.items}}, function (err){
				if (err)
				{
					debug ('Cannot add items to cart '+err);
					cb (err);
				}
				else
					User.update ({_id: userId}, {'$set': {items: []}}, function (err){
						if (err)
							debug ('Cannot empty items '+err );
						cb (err);
					});
			});
		}
	});
}


module.exports = function (cb)
//function initDb ()
{
	mongoose.connect(URL);
	var db = mongoose.connection;
	db.on('error', function (err) {debug('connection error: '+err)});

	db.once('open', function (callback) {
		debug ('Connected to database');
	//	getItemByCriteria (null, null , 3, function (err, doc){console.log(doc);});
	// 	addUser ('ioana', 'parolamea', function (err){});
	// 	addItem(
	// 		{name: 'Formula D',
	// description: 'Formula D is a high stakes Formula One type racing game where the players race simulated cars with the hope of crossing the finish line first. This is a re-release of Formula Dé with several changes from the original format. Whilst old tracks can be used with the updated Formula D rules, the new game features boards that have an F1 track and a Street Track on the other side. These street tracks each have a novel inclusion or two to add greater theme -',
	// difficulty: 'easy',
	// minPlayers: 2,
	// maxPlayers: 10,
	// theme: ['racing', 'sport', 'funny'],
	// price: 295,}, function (err){});
	// addItem(
	// 		{name: '7 Wonders',
	// description: 'You are the leader of one of the 7 great cities of the Ancient World. Gather resources, develop commercial routes, and affirm your military supremacy. Build your city and erect an architectural wonder which will transcend future times.',
	// difficulty: 'medium',
	// minPlayers: 2,
	// maxPlayers: 7,
	// theme: ['adventure', 'funny'],
	// price: 180}, function (err){});
		if (cb)
			cb();
	});
}

module.exports.addUser = addUser;
module.exports.addItemToBasket = addItemToBasket;
module.exports.addItemsToBasket = addItemsToBasket;
module.exports.getCart = getCart;
module.exports.getItemsByCriteria = getItemByCriteria;
module.exports.getItemById = getItemById;
module.exports.getItemByName = getItemByName;
module.exports.getUser = getUser;
module.exports.difficulties = difficulties;
module.exports.removeItemFromBasket = removeItemFromBasket;
module.exports.themes = themes;

