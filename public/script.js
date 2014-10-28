  // create the module and name it musicApp
  var musicApp = angular.module('musicApp', ['ngRoute', 'firebase', 'angularFileUpload', 'angular-loading-bar']);

 
  musicApp.config(function($httpProvider) {
     $httpProvider.interceptors.push(function($q) {
        return {
          responseError: function(rejection) {
                if(rejection.status == 0) {
                    console.log(rejection);
                    return;
                }
                return $q.reject(rejection);
            }
        };
    });
});


  // configure our routes
  musicApp.config(function($routeProvider) {
    $routeProvider

      // route for the home page
      .when('/', {
        templateUrl : 'pages/home.html',
        controller  : 'mainController'
      })


        .when('/clouddrive', {
        templateUrl : 'pages/clouddrive.html',
        controller  : 'cloudDrive'
      })


        // route for the track page
      .when('/upload', {
        templateUrl : 'pages/upload.html',
        controller  : 'uploadController'
      })
         // route for the track page
      .when('/upload-podcast', {
        templateUrl : 'pages/uploadPodcast.html',
        controller  : 'uploadPodcastController'
      })
       // route for the track page
      .when('/track/:trackslug', {
        templateUrl : 'pages/track.html',
        controller  : 'trackController'
      })
       // route for the playlist page
      .when('/playlist/:trackslug', {
        templateUrl : 'pages/about.html',
        controller  : 'aboutController'
      })

      .when('/download', {
        templateUrl : 'pages/downloadpage.html',
        controller  : 'downloadController'
      })
        .when('/search/:searchterm', {
        templateUrl : 'pages/search.html',
        controller  : 'searchController'
      })

        .when('/queue/:roomname', {
        templateUrl : 'pages/queue.html',
        controller  : 'queueController'
      })



      // route for the contact page
      .when('/contact', {
        templateUrl : 'pages/contact.html',
        controller  : 'contactController'
      });
  });


/*
musicApp.factory('liveQueue', ['$window', '$rootScope', function($rootScope) {


  queueList: function() {


  },




}]);

*/
/*
musicApp.factory('dataService', function($firebase) {

//  var ref = new Firebase("https://gplayer.firebaseio.com/");
  

  return ref;


});

*/

musicApp.factory('player', ['$window', function() {
   
   //var factoryQueue = dataService.$child('queue');
    //var queues = dataService.child('queues');

    var rootRef = new Firebase("https://gplayer.firebaseio.com/queues");
    
    console.log(rootRef);
    //var sync = $firebase(rootRef);

    //var queueArray = rootRef.$asArray();
  
    var songPosition = 0;
   var player = {


    listofSongs : {list: []},

    getQueueList: function() {
      
      return queueArray
    },

    addSongToQueue: function (songobject) {

     queueArray.$add(songobject);

    },

    playQueue: function(soundObject, songPosition, loadedSongs) {

    
    //Toggle play and pause button
     $(".jp-play").css('display', 'none');
     $(".jp-pause").css('display', 'inline-block');


    soundManager.destroySound('aSound');
     
    console.log(soundObject + '  is my object');
     if (soundObject.url.indexOf("http") !=-1) {
        console.log('http in string so play direct');
        }

    else {
        soundObject.url = 'http://southpawgroup.com/gidimusicplayer/gidimusic/newplayer/songs/Various/' + soundObject.url

        };


      //soundmanager object
       soundManager.setup({
            
          onready: function() {
            var mySound = soundManager.createSound({
              id: 'aSound',
              url: soundObject.url,

              whileplaying: function() {
                  var currentPercentage = (this.position / this.duration) * 100;
                   $(".jp-play-bar").css('width', currentPercentage + '%');

                   var millistosecond = function (millis) {

                        var minutes = Math.floor(millis / 60000);
                        var seconds = ((millis % 60000) / 1000).toFixed(0);
                        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

                   };



                    $(".jp-current-time").text(millistosecond(this.position));
                    $(".jp-duration").text(millistosecond(this.duration));
                                  
                    
                  },
              onfinish: function() {
        
                player.playNextQueue(loadedSongs, songPosition);
     
     
            },
                
                });
            
         

            mySound.play();
            $(".jp-title").text(soundObject.title);
            $('.nowPlayingArt').attr('src', soundObject.thumbnail);


            },

          });


  //Seeking
   $(".jp-seek-bar").click(function(e){
                 
            var sound = soundManager.getSoundById('aSound');
            console.log(sound.position);

            var x = e.pageX - $(this).offset().left,
            width = $(this).width(),
            duration = sound.durationEstimate;


            sound.setPosition((x / width) * duration);

              });
  



    },

    playNextQueue : function (loadedSongs, songPosition) {

            $(".jp-play-bar").css('width', 0 + '%');
                $(".jp-pause").css('display', 'none');
                $(".jp-play").css('display', 'inline-block');



                
                var nextPosition = songPosition + 1;
              
               
                
                
                if(loadedSongs[nextPosition] !== undefined)  {
                      player.playQueue(loadedSongs[nextPosition], nextPosition, loadedSongs);    
                  }
                  else if (loadedSongs[nextPosition] == undefined )
                  {
                    console.log('end of list');
                  };


    },

    
    play: function(soundObject, songPosition, loadedSongs) {

    $('.musicbar').addClass('animate');

     $(".jp-play").css('display', 'none');
     $(".jp-pause").css('display', 'inline-block');
     


  
     //player.current = soundObject.title; 
     player.nowPlaying = soundObject.title;

      console.log('We are playing song number  ' + songPosition);
      
     //destroy previously loaded sound
     soundManager.destroySound('aSound');
     console.log(soundObject.source)
     

         if (soundObject.url.indexOf("http") !=-1) {
            console.log('http in string so play direct');
            }

        else {
            soundObject.url = 'http://southpawgroup.com/gidimusicplayer/gidimusic/newplayer/songs/Various/' + soundObject.url

            };

        soundManager.setup({
            
          onready: function() {
            var mySound = soundManager.createSound({
              id: 'aSound',
              url: soundObject.url,

              whileplaying: function() {
                  var currentPercentage = (this.position / this.duration) * 100;
                   $(".jp-play-bar").css('width', currentPercentage + '%');

                   var millistosecond = function (millis) {

                        var minutes = Math.floor(millis / 60000);
                        var seconds = ((millis % 60000) / 1000).toFixed(0);
                        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

                   };



                    $(".jp-current-time").text(millistosecond(this.position));
                    $(".jp-duration").text(millistosecond(this.duration));
                                  
                    
                  },
              onfinish: function() {
                $(".jp-play-bar").css('width', 0 + '%');
                $(".jp-pause").css('display', 'none');
                $(".jp-play").css('display', 'inline-block');



                var nextUrl = loadedSongs[songPosition + 1].url;
                var nextPosition = songPosition + 1;
                var nextSong = loadedSongs[nextPosition];
                player.position = nextPosition;

                player.play(nextSong, nextPosition, loadedSongs);

                songPosition = player.position + 1;
                
                console.log('we are playing song ' + player.position);
     
            },


                
                });
            
         


           //console.log(sound.durationEstimate);
            mySound.play();
            $(".jp-title").text(soundObject.title);


            },

          });



  //Seeking
   $(".jp-seek-bar").click(function(e){
                 
            var sound = soundManager.getSoundById('aSound');
            console.log(sound.position);

            var x = e.pageX - $(this).offset().left,
            width = $(this).width(),
            duration = sound.durationEstimate;


            sound.setPosition((x / width) * duration);

              });
            
             player.playing = true
    },

    playNext: function() {
              var nextPosition = songPosition + 1;
              var nextSong = player.listofSongs.list[nextPosition];
              player.play(nextSong, nextPosition);

            },

    playPrevious: function() {
              var previousPosition = player.position - 1;
              var nextSong = player.loadedSongs[previousPosition];
              player.play(nextSong, previousPosition, player.loadedSongs);

            },

    playSingle: function(soundObject) {
               var nextPosition = player.position + 1;
              //player.loadedSongs.push(soundObject);
              player.play(soundObject, nextPosition, player.loadedSongs);


            },

    pauseSong: function() {

        console.log('now pause');
        soundManager.togglePause('aSound');
      
      
        $(".jp-pause").css('display', 'none');
        $(".jp-play").css('display', 'inline-block');
         $('.musicbar').removeClass('animate');
        

    },


    playSong: function() {

        console.log('now play');
        soundManager.togglePause('aSound');
      
      
        $(".jp-pause").css('display', 'inline-block');
        $(".jp-play").css('display', 'none');
         $('.musicbar').addClass('animate');
        

    },

    stop: function() {
      if (player.playing) {
        audio.pause(); // stop playback
        // Clear the state of the player
        player.ready = player.playing = false; 
        player.current = null;
      }
    }
    
    };


  return player;
}]);





  musicApp.controller('mainController', function($scope, $rootScope, $http, $location, player) {


    $scope.loadedQueue = [];


    //search form
    $scope.sendSearch = function() {

        $location.path('/search/'+ $scope.searchText);
    };




    //load homepage playlist
    $http.get('/api/song/cloudafrica')
      .success(function(data) {
    
       //console.log(data);
       //$scope.loadedSongs = data.tracks;
       //$scope.loadedQueue = $scope.loadedSongs;

    })

      .error(function(data) {
      console.log('Error: ' + data);
    });


    //play button
    $scope.playnewSound = function(soundObject, songPosition) {
   
      player.play(soundObject, songPosition, $scope.loadedQueue);

   
    };

    $scope.playNext = function() {
      player.playNext();
    };

    $scope.playPrevious = function() {
      player.playPrevious();
    };

    $scope.pauseSong = function() {
      player.pauseSong();
       
    };

    
    $scope.playSong = function() {
      
      player.playSong();
     
    };


  
  });




musicApp.controller('downloadController', function($scope, $http) {


    $scope.downloadStatus = 'ready to save';
    $scope.url = "";
    $scope.response = '';
    $scope.sendPost = function() {

        $scope.downloadStatus = 'downloading';
        var data = { url: $scope.url };
              
        
        $http.post("/api/download/", data).success(function(data, status) {
           
           console.log(data);
           $scope.downloadStatus = 'saved to server';

        });
        $scope.url = '';
    };


  
  });


musicApp.controller('queueController', function($scope, $http, player, $firebase, $routeParams) {
  
    //search form
    $scope.sendSearch = function() {

        console.log($scope.searchText);
    };



  $scope.roomname = $routeParams.roomname;


  $scope.incomingQueue = [];

  var ref = new Firebase("https://gplayer.firebaseio.com/queues/" + $scope.roomname);

  // GET MESSAGES AS AN ARRAY
  $scope.incomingQueue = $firebase(ref).$asArray();

  


     var socket = io();
     
    
    $scope.username = '';

    // on connection to server, ask for user's name with an anonymous callback
    socket.on('connect', function(){
    // call the server-side function 'adduser' and send one parameter (value of prompt)
    //socket.emit('adduser', prompt("What's your name?"));
  });

   



    socket.on('incomingSong', function(loadedSong) {
      console.log(loadedSong.title);

      //$scope.incomingQueue.$add(loadedSong);
     


      player.addSong(loadedSong);
   
    

    });



$scope.startQueue = function() {


  player.playQueue($scope.incomingQueue[0], 0, $scope.incomingQueue);

};
    

$scope.removeFromQueue = function(index) {

  $scope.incomingQueue.$remove(index);


};


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

    $scope.addtoQueue = function (loadedSong, index) {

        //loadedSong.addedBy = $scope.username;
        //socket.emit('addtoQueue', loadedSong);
        $scope.loadedSongs.remove(index);
        //player.addSongToQueue(loadedSong);
        $scope.incomingQueue.$add(loadedSong);

        
   


    };


     $scope.playnewSound = function(soundObject, songPosition) {
   
      player.play(soundObject, songPosition, $scope.loadedSongs);
   
    };

    //Live search

    $scope.runSearch = function() {

            $http.get('/api/search/'+ $scope.songSearch )
            .success(function(data) {

              console.log(data);
             $scope.loadedSongs = data.tracks.tracks;

    });

};

  
  });


musicApp.controller('uploadController', function($scope, $upload) {


   $scope.onFileSelect = function($files) {
    
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: 'api/upload', 
        method: 'POST',
        headers: {'header-key': 'header-value'},
        data: {myObj: $scope.myModelObj},
        file: file, 
      }).progress(function(evt) {
      
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        $scope.progress = 'percent: ' + parseInt(100.0 * evt.loaded / evt.total)
      

      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
      });
      //.error(...)
      //.then(success, error, progress); 
      // access or attach event listeners to the underlying XMLHttpRequest.
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})
    }
 
  };

  });



musicApp.controller('uploadPodcastController', function($scope, $upload, $http) {

      $scope.formdata = {};

      $scope.formValid = false;
        
      $scope.uploadQueue = [];

     $scope.addToUploadQueue = function($files) {

      //$scope.uploadQueue = $files;

          $scope.selectedFiles = $files;
     };

      // $scope.submitForm = function() {
        
      //   //$scope.hideForm = true;
     
   
      //   var data = {
      //     podcastShow: $scope.formdata.radioShow,
      //     podcastTitle: $scope.formdata.title,
      //     fileName: $scope.uploadedUrl,
      //     timeUploaded: Date.now()
      //   };

      //   $http.post("/api/submitPodcast", data).success(function(data, status) {
      //        console.log(data);
      //        console.log('Form Submitted');
      //     });

      // };

  $scope.selectedFiles = [];

   $scope.onFileSelect = function() {


    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $scope.selectedFiles.length; i++) {
      var file = $scope.selectedFiles[i];
      $scope.upload = $upload.upload({
        url: 'api/upload', 
        method: 'POST',
        headers: {'header-key': 'header-value'},
        data: {myObj: $scope.formdata.radioShow, formData: $scope.formdata},
        file: file,

      }).progress(function(evt) {
      
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        $scope.progress = 'percent: ' + parseInt(100.0 * evt.loaded / evt.total)
      

      }).success(function(data, status, headers, config) {
        
        // file is uploaded successfully
        console.log(data);
      });
      //.error(...)
      //.then(success, error, progress); 
      // access or attach event listeners to the underlying XMLHttpRequest.
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})
    }
 
    console.log('http://southpawgroup.com/gidiradio/'+ $scope.formdata.radioShow + '/' + file.name);
    $scope.uploadedUrl = 'http://southpawgroup.com/gidiradio/'+ $scope.formdata.radioShow + '/' + file.name;
    

   

   


  };



  
  });

  


  musicApp.controller('cloudDrive', function($scope, $rootScope, $http, player) {


      $http.get('/api/readfiles/')
      .success(function(data) {
    
       console.log(data);
       //$scope.loadedSongs = data.tracks;

    })

      .error(function(data) {
      console.log('Error: ' + data);
    });



   //loaded Songs
$scope.loadedSongs =  {
    "tracks_order": "1949,1979,3048,403,879,302",
    "starred": false,
    "id": 3728,
    "number_of_plays": 0,
    "owner": {
        "username": "guest",
        "name": ""
    },
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

      
    ],
    "created_at": "2014-09-06",
    "owner_id": 2874,
    "title": "420",
    "slug": "2X4S"
};

console.log($scope.loadedSongs);



  });

  musicApp.controller('aboutController', function($scope, $http, $routeParams, $rootScope, player) {



    console.log($routeParams.trackslug);

    $http.get('/api/song/'+ $routeParams.trackslug )
      .success(function(data) {
    
       console.log(data);
       $scope.loadedSongs = data.tracks;



    })

      .error(function(data) {
      console.log('Error: ' + data);
    });



$scope.playnewSound = function(soundObject, songPosition) {
   
      player.play(soundObject, songPosition, $scope.loadedSongs);
   
    };


    $scope.playNext = function() {
      player.playNext();
    };

      $scope.playPrevious = function() {
      player.playPrevious();
    };


   //$scope.playSound();



  });


musicApp.controller('trackController', function($scope, $http, $routeParams, $rootScope, player) {

  
  


    $http.get('/api/track/'+ $routeParams.trackslug )
      .success(function(data) {
     
       console.log(data);
       $scope.loadedSongs = data;
      

     
    })

      .error(function(data) {
      console.log('Error: ' + data);
    });


    $scope.playSingle = function(soundObject) {
   
      player.playSingle(soundObject);
   
    };


    $scope.playNext = function() {
      player.playNext();
    };

      $scope.playPrevious = function() {
      player.playPrevious();
    };

   //$scope.playSound();




});
 

musicApp.controller('searchController', function($scope, $http, $routeParams, player) {


    $scope.playnewSound = function(soundObject, songPosition) {
   
      player.play(soundObject, songPosition, $scope.loadedSongs);
   
    };

    console.log($routeParams.searchterm);
    $scope.searchterm = $routeParams.searchterm;

      $http.get('/api/search/'+ $scope.searchterm )
      .success(function(data) {
     
      $scope.loadedSongs = data.tracks.tracks;

    
    });

  });

 