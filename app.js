/*
*	Load Packages
*/
	var express = require('express');
	var mongoose = require('mongoose');
	var rd = require('recursive-readdir');
	var fs = require('fs');
	var path = require('path');
/*
*	Config Server
*/
	var app = express();
	mongoose.connect('mongodb://localhost/admin_database');
	app.use(require('body-parser').json({
		'limit': '5mb'
	}));
	// app.use(require('cookie-parser')());
	// app.use(require('morgan')('dev'));
	// app.use(require('method-override')('X-HTTP-Method-Override'));
	app.use(require('node-sass-middleware')({
		src: process.cwd() + '/client',
		dest: process.cwd() + '/client',
		debug: true,
		outputStyle: 'compressed',
		force: true
	}));
/*
*	Mongodb
*/
	var Picture = require(__dirname+'/Schema.js');
	var attach_points = function(img, cb){
		Picture.findOne({
			loc: img.loc
		}, function(err, doc){
			if(doc&&doc.points){
				img.points = doc.points;
			}else img.points = 0;
			cb();
		});
	}
/*
*	Serve
*/
	var img_folder = __dirname+'/_images';
	app.get('/api/images', function(req, res){
		rd(img_folder, function(err, files) {
			var counter = files.length;
			for (var i = 0; i < files.length; i++) {
				files[i] = {
					loc: files[i].split('_images')[1]
				}
				attach_points(files[i], function(){
					if(--counter===0) res.json(files);
				});;
			}
		});
	});
	app.post('/api/rate', function(req, res){
		Picture.findOne({
			loc: req.body.loc
		}, function(err, doc){
			if(err||!doc){
				doc = new Picture(req.body);
			}else{
				doc.points = req.body.points;
			}
			doc.save(function(){
				res.json(true);
			});
		});
	});
	app.post('/api/remove', function(req, res){
		Picture.findOne({
			loc: req.body.loc
		}, function(err, doc){
			if(err||!doc){
				doc = new Picture(req.body);
			}
			doc.points = 0;
			doc.status = 'Archived';
			doc.save(function(){});
			/*
			*	Deleted images will be renamed to Doc._id + file name
			*/
			var _a = __dirname+'/_achieved/'+doc._id+'_'+path.basename(req.body.loc);
			fs.rename(img_folder+req.body.loc, _a, function(){
				res.json(true);
			});
		});
	});
	app.get('/', function(req, res){
		res.sendFile(__dirname+'/client/html/index.html');
	});
	app.use('/_img', express.static(img_folder));
	app.use('/:folder/:file', function(req, res){
		res.sendFile(__dirname+'/client/'+req.params.folder+'/'+req.params.file);
	});
	app.listen(4567);
/*
*	End of server
*/