## ngProgress.js

[![Build Status](https://travis-ci.org/VictorBjelkholm/ngProgress.png?branch=master)](https://travis-ci.org/VictorBjelkholm/ngProgress)

ngProgress is a provider for angular for showing a loading status of something.
Use cases can be fetching external resources, showing a action taking more-than-normal length
or simple loading between the page views. Prefereble, only for resource heavy sites.

## Usage

Download ngProgress.js manually or install with bower

```bower install ngprogress```

Include ngProgress.js ( or ngProgress.min.js) and ngProgress.css in your website.

```<script src="app/components/ngProgress/ngProgress.min.js"></script>```
```<link rel="stylesheet" href="ngProgress.css">```

Set ngProgress as a dependency in your module

```var app = angular.module('progressApp', ['ngProgress']);```


Inject ngProgress provider in controller

```var MainCtrl = function($scope, $timeout, ngProgress) {
}```

Use with the API down below

```
ngProgress.start();
$timeout(ngProgress.complete(), 1000);
```

## API
```
// Starts the animation and adds between 0 - 5 percent to loading
// each 400 milliseconds. Should always be finished with ngProgress.complete()
// to hide it

ngProgress.start();

// Sets the height of the progressbar. Use any valid CSS value
// Eg '10px', '1em' or '1%'

ngProgress.height();

// Sets the color of the progressbar and it's shadow. Use any valid HTML
// color

ngProgress.color();

// Returns on how many percent the progressbar is at. Should'nt be needed

ngProgress.status();

// Stops the progressbar at it's current location

ngProgress.stop();

// Set's the progressbar percentage. Use a number between 0 - 100. 
// If 100 is provided, complete will be called.

ngProgress.set();

// Resets the progressbar to percetage 0 and therefore will be hided after
// it's rollbacked

ngProgress.reset();

// Jumps to 100% progress and fades away progressbar.

ngProgress.complete();
```

##License

The MIT License (MIT)

Copyright (c) 2013 Victor Bjelkholm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
