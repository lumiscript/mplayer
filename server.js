	// set up ========================
	var express  = require('express');
	var app      = express(); 								// create our app w/ express
	var mongoose = require('mongoose'); 					// mongoose for mongodb
	var morgan = require('morgan'); 			// log requests to the console (express4)
	var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
	var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
	var request = require('request');
	var cheerio = require('cheerio');
	var dir = require('node-dir');
	var Download = require('download');
	var progress = require('download-status');
	var fs = require('fs');
	var Busboy = require('busboy');
	var busboy  = require('connect-busboy');
	var os = require('os');
	var path = require('path');
	var JSFtp = require("jsftp");
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	



	var bodyParser = require('body-parser');
	app.use( bodyParser.json() );     
	app.use( bodyParser.urlencoded() );

	// configuration =================

	mongoose.connect('mongodb://lumi:Fibonacci1234@dharma.mongohq.com:10073/gidimongo');

	

	app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
	app.use(morgan('dev')); 										// log every request to the console
	app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
	app.use(bodyParser.json()); 									// parse application/json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
	app.use(methodOverride());
	app.use(busboy({ immediate: true }));



	

	//listen for any socket connections
	io.on('connection', function(socket){
  		console.log('a user connected');


		// when the client emits 'adduser', this listens and executes
		socket.on('addtoQueue', function(loadedSong){
			console.log(loadedSong);

			socket.broadcast.emit('incomingSong', loadedSong);


		});


  	 socket.on('disconnect', function(){
    console.log('user disconnected');
  	
  	});
  		

	
	});


	



	//setup ftp
	var Ftp = new JSFtp({
		  host: "southpawgroup.com",
		  port: 21, // defaults to 21
		  user: "gidipodcasts", // defaults to "anonymous"
		  pass: "Fibonacci1234%" // defaults to "@anonymous"
	});




	var Song = mongoose.model('Songs', {
		title: String,
		url: String,
		artist: String,
		thumbnail: String,
		plays: Number,
		id: Number

	});



	//get list of songs
	app.get('/api/song', function(req, res) {

		Song.find(function(err, song) {
				if (err)
					res.send(err)
				res.json(song);


			});
		

	});



	//download song

	app.post('/api/download', function(req, res) {

		var url = req.body.url;
		console.log(url);
	
		var download = new Download()
		    .get(url, 'destFolder')
		    .use(progress());

		download.run(function (err, files) {
		    if (err) {
		        throw err;
		    }
	
		    console.log(files);
		    res.json(files);
		});

	});


	//upload song

		//download song

	app.post('/api/upload', function(req, res) {

	
		var filepath = '';
		
	    
	    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
	    
	    var filepath = 'destFolder/' + filename;
	    var fstream = fs.createWriteStream(filepath); 
        file.pipe(fstream);

     
        console.log(fstream.path);

         Ftp.put(fstream.path, 'soundbuzz/'+filename, function(hadError) {
		  if (!hadError)
		    console.log("File transferred successfully!");
		});

	      //console.log(saveTo);


	    });



	    req.busboy.on('finish', function() {
	      res.writeHead(200, { 'Connection': 'close' });
	      res.end("That's all folks!");
	      console.log('upload complete!!');
	    });



	});


	app.get('/api/readfiles', function(req, res) {
	
	
		dir.files('music', function(err, files) {
			    if (err) throw err;
			    console.log(files);
			    res.json(files);
			    
			});


	});


	//send to airplay

	app.get('api/airplay/:url', function(req, res) {

	var receivedUrl = req.param('url');


	browser.on('deviceOnline', function(device) {

		console.log(browser.getDevices());
		console.log('device online: ' + device.id);

	    device.play(receivedUrl, 0);



		setInterval(function() {
	      
	      	device.status(function(res) {
	 
			   	console.log('duration:  ' + res.duration);
				console.log('position:  ' + res.position);

		});     

	      
	      }, 40000 );



  });


	});



	//search 

	app.get('/api/search/:searchterm', function(req, res) {

		//	console.log(req.param('searchterm'));
		var receivedSlug = req.param('searchterm');


		request('http://gplayer.herokuapp.com/api/search/?q=' + receivedSlug, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    console.log(body); // Print the google web page.
			    var parsedBody = JSON.parse(body);
			    res.json(parsedBody);
			  }
			})


	});



	//get list of songs
	app.get('/api/song/:song', function(req, res) {

		console.log(req.param('song'));
		var receivedSlug = req.param('song');


		request('http://gplayer.herokuapp.com/api/playlist/'+ receivedSlug, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    //console.log(body); // Print the google web page.
			    var parsedBody = JSON.parse(body);
			    res.json(parsedBody);
			  }
			})

	});

	//get list of songs
	app.get('/api/track/:song', function(req, res) {

		//console.log(req.param('song'));
		var receivedSlug = req.param('song');


		request('http://gplayer.herokuapp.com/api/track/'+ receivedSlug, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    //console.log(body); // Print the google web page.
			    var parsedBody = JSON.parse(body);
			    res.json(parsedBody);
			  }
			})

	});


	app.get('/api/song/download', function(req, res) {

		var soundfile = 'http://www.gidilounge.com/wp-content/uploads/2014/07/Show_Me_De_Money_2.mp3';
		var ws = fs.createWriteStream('sounds/wizzy.mp3');
		ws.on('error', function(err) { console.log(err); });
		request(largeImage).pipe(ws);

		

	});


	//post a song
	app.post('/api/song', function(req, res) {

		Song.create({
			title: req.body.title,
			url: req.body.url,
			artist: req.body.artist,
			thumbnail: req.body.thumbnail,
			plays : req.body.plays,
			id: req.body.id

		}, function(err, song) {
			if(err)
				res.send(err);

			Song.find(function(err, song) {
				if (err)
					res.send(err)
				res.json(song);


			});
		});

	});


	app.get('/api/scrape', function(req, res){
	
	url = 'http://jaguda.com/category/music/';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var title, url, thumbnail;
			var json = { title : "", url : "", thumbnail : ""};


			


            // We'll use the unique header class as a starting point.

			$('#example-1').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.

		        var data = $(this);

           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

		        title = data.children().first().text();

           // Once we have our title, we'll store it to the our json object.

		        json.title = title;



		        console.log(title);
	        });

	        	$('.main-content').filter(function(){


	        		function Track(title, url, thumbnail) {
	        			this.title = title;
	        		//	this.url = url;
	        		//	this.thumbnail = thumbnail;

	        		};

	        		var tracks = [];

					$('article').each(function(i, elem) {
					  
					  var title = $('p').text();
					  //var url = $('a').attr('href');
					  console.log($('a').attr('title'));

					  tracks.push(title);
					});

					$('article .post-content a').each(function(i, elem) {
					  //tracks[i].title = $(this).text();
					  tracks.push(new Track($(this).text()));
					});


					//console.log(tracks);


	        	});
		}
	})
})





	//application route
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});



	// listen (start app with node server.js) ======================================
	http.listen(8080);
	console.log("App listening on port 8080");

