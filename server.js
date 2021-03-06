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
	var fs = require('fs-extra');
	var os = require('os');
	var path = require('path');
	//var JSFtp = require("jsftp");
	var Client = require('ftp');

	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	var qt   = require('quickthumb');
	var formidable = require('formidable');
	var util = require('util');
	var cheerio = require("cheerio");
	var wordpress = require( "wordpress" );


	var bodyParser = require('body-parser');
	app.use( bodyParser.json() );     
	app.use( bodyParser.urlencoded() );

	

	app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
	app.use(morgan('dev')); 										// log every request to the console
	app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
	app.use(bodyParser.json()); 									// parse application/json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
	app.use(methodOverride());



	 // Use quickthumb
	app.use(qt.static(__dirname + '/'));


	//MongoDB hookup
	var monk = require('monk');
	var db = function() {
	    return monk('mongodb://lumi:Fibonacci1234@dharma.mongohq.com:10073/gidimongo');
	} 

	 var mongoInsert = function(mongoObject, user) {

	 	var collection = db().get('musicPlayer');

	 	collection.update({room: user},{'$push': 
	{ "queue": mongoObject}});

	    };


// Wordpress hookup
	var client = wordpress.createClient({
    url: "gidilounge.fm",
    username: "lumi",
    password: "thisisatest123"
	});

	// client.getPosts(function( error, posts ) {
	//     console.log( "Found " + posts.length + " posts!" );
	//     console.log(posts);

	//     for (i=0; i < posts.length; i++) {

	//     	console.log(posts[i].title);
	//     }

	// });


	

	//listen for any socket connections
	io.on('connection', function(socket){
  		console.log('a user connected');

  		


  		// when the client emits 'adduser', this listens and executes
		socket.on('addtoQueue', function(loadedSong){
			console.log(loadedSong);
			mongoInsert(loadedSong, 'coollounge')

			socket.broadcast.emit('incomingSong', loadedSong);


		});




  	 socket.on('disconnect', function(){
    console.log('user disconnected');
  	
  	});
  		

	
	});


	


	// //setup ftp
	// var Ftp = new JSFtp({
	// 	  host: "southpawgroup.com",
	// 	  port: 21, // defaults to 21
	// 	  user: "gidipodcasts", // defaults to "anonymous"
	// 	  pass: "Fibonacci1234%" // defaults to "@anonymous"
	// });




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



	//get list of queue
	app.get('/api/getQueue', function(req, res) {

		var songQueue = {
			"tracks": [


				  {
            "artist": {
                "slug": "yemi-alade",
                "name": "Yemi Alade"
            },
            "slug": "KN9WrS",
            "starred": false,
            "plays": 1787,
            "id": 1949,
            "title": "Faaji",
            "url": "http://www.southpawgroup.com/gidiradio/songs/Faaji.mp3",
            "thumbnail": "http://southpawgroup.com/gidiloungeart/images/albums_thumbnail/yemialade500.jpg",
            "is_external": true,
            "album": {
                "title": "yemi Alade - Single",
                "slug": "yemi-alade-single",
                "thumbnail": "http://southpawgroup.com/gidiloungeart/images/albums_thumbnail/yemialade500.jpg"
            }
        },
        
        {
            "artist": {
                "slug": "burna-boy",
                "name": "Burna Boy"
            },
            "slug": "6r9MCq",
            "starred": false,
            "plays": 10478,
            "id": 1979,
            "title": "Smoke Some Weed ft. Onos",
            "url": "http://www.southpawgroup.com/gidiradio/songs/weed.mp3",
            "thumbnail": "http://southpawgroup.com/gidiloungeart/images/albums_thumbnail/BurnaBoy2_BW.jpg",
            "is_external": true,
            "album": {
                "title": "Burna Boy Hot 10",
                "slug": "burna-boy-hot-10",
                "thumbnail": "http://southpawgroup.com/gidiloungeart/images/albums_thumbnail/BurnaBoy2_BW.jpg"
            }
        }

			]
		};

				res.json(songQueue);

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


	//scrape site

	app.get('/api/naijamp3', function(req, res) {

	
		request('http://www.naijamp3s.com/category/music/', function(error, response, body) {
		
		
			var songs = [];
		  	var $ = cheerio.load(body);


		$('.post h1 a').each(function(i, elem) {

			//console.log($(elem).attr('href') + '  \n');
		
			});



		var myObject = [];
		var id = 0;

		$('.post .td-post-text-content').each(function(i, elem) {

			var postcontent = $(elem).text();

			myObject.push({id: id, content: postcontent});
			id = id + 1;

			//console.log($('p a img').attr('src'));


			});


			$('.size-full').each (function(i, elem) {

				//console.log($(elem).attr('src'));

					
			});

			$('.td-post-text-content p a').each(function(i, elem) {

				console.log($(elem).attr('href'));

			});
			

		//console.log(myObject)



		});






	});

	// client.newPost({
	//       title: 'Your title',
	//       status: 'draft', //'publish, draft...',
	//       content: '<strong>This is the content</strong>',
	//       author: 2, // author id
	//       terms: {'category': [302]}
	//     },
	//     function() { 
	//       console.log(arguments);
	//     }
	// );

	//submit podcast
		//download song
	app.post('/api/submitPodcast', function(req, res) {


		var podcastDetails = {
		
			podcastShow: req.body.podcastShow ,
	        podcastTitle: req.body.podcastTitle,
	        fileName: req.body.fileName,
	        timeUploaded: req.body.timeUploaded
			
		};

		//console.log(podcastDetails);


	});



	



	//download song
	app.post('/api/upload', function(req, res) {


		var podcastDirectory = '';
			
		var form = new formidable.IncomingForm();

	   form.parse(req, function(err, fields, files) {
      // res.writeHead(200, {'content-type': 'text/plain'});
      // res.write('received upload:\n\n');
      // res.end(util.inspect({fields: fields, files: files}));

	      podcastDirectory = fields.myObj;
	      console.log(fields.formData);
    });


     form.on('end', function(fields, files) {
        
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'destFolder/';

        podcastDirectory =  podcastDirectory + '/';
 
        fs.copy(temp_path, new_location + file_name, function(err) {  
            if (err) {
                console.error(err);
                res.json({status: err});

            } else {
                console.log("success!")


    //                 Ftp.put(new_location + file_name, podcastDirectory+file_name, function(hadError) {
				// 	  if (!hadError)
				//     console.log("File transferred to--  "+ podcastDirectory+file_name + "  --FTP successfully!");

				// 	res.json({status: 'complete'});
				// 	//res.send('<p>File Transfer Complete</p>');
					
				// });

        	var c = new Client();
			    c.on('ready', function() {
			    
			     c.put(new_location + file_name, podcastDirectory+file_name, function(err) {
			      if (err) throw err;
			      res.json({status: 'complete'});
			      c.end();
			    });

				  });
		  // connect to localhost:21 as anonymous
		  c.connect({ host: 'ftp.southpawgroup.com', user: 'gidipodcasts', password: 'Fibonacci1234%' });		
		





            }
        });

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

