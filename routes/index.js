var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

var Message = require('../models/message');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {
		console.log("Authenticated");
		return next();
	}
	// res.redirect('/login');
	res.render('login', { message: req.flash('message')} );
}

router.get('/', isAuthenticated, function (req, res) {
	Message.find(function (err, messages) {
		if (err) return console.error(err);
		res.render('test', { messages :  messages, user : req.user });	
	});
});

router.post('/login', passport.authenticate('login', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash : true  
}));

router.get('/login', function(req, res){
	res.render('login', { message: req.flash('message')} );
});

router.get('/signup', function(req, res){
	res.render('login', { message: req.flash('message')} );
});

router.post('/signup', passport.authenticate('signup', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash : true  
}));

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;