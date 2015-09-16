var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index', {
		page_name: 'index'
	});
});

app.get('/data', function(request, response) {
	response.render('pages/data', {
		page_name: 'data'
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);
// The response object is returned with a status field that lets the
// app know the current login status of the person.
// Full docs on the response object can be found in the documentation
// for FB.getLoginStatus().
if (response.status === 'connected') {
  // Logged into your app and Facebook.
  testAPI();
  if (window.location != '/data') {
  	window.location.replace('/data');
  }
} else {
	console.log('log in to continue');
	if (window.location != '/') {
		window.location.replace('/');
	}
}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

window.fbAsyncInit = function() {
	FB.init({
		appId      : '860386630696520',
cookie     : true,  // enable cookies to allow the server to access 
                    // the session
xfbml      : true,  // parse social plugins on this page
version    : 'v2.2' // use version 2.2
});

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});

  // Load the SDK asynchronously
  (function(d, s, id) {
  	var js, fjs = d.getElementsByTagName(s)[0];
  	if (d.getElementById(id)) return;
  	js = d.createElement(s); js.id = id;
  	js.src = "//connect.facebook.net/en_US/sdk.js";
  	fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me', function(response) {
		console.log('Successful login for: ' + response.name);
	});
}


if (window.location == '/data') {
	$(window).load(function(){
		$('#myModal').modal('show');
	});

	var associativeArray = {};
	var groupName = "";
	var groupID;

	function getGroupID() {
		groupID = $('#groupid').val();
		console.log('group id is ' + groupID)
		apiCall();
	}

	function apiCall() {
		FB.api(
			"/" + groupID,
			function (response) {
				if (response && !response.error) {
					groupName = response.name;
				}
			}
			);
		FB.api(
			"/" + groupID + "/feed?limit=10000&fields=from",
			function (response) {
				if (response && !response.error) {
					for (var i = response.data.length - 1; i >= 0; i--) {
						if (associativeArray[response.data[i].from.name] === undefined) {
							associativeArray[response.data[i].from.name] = 1;
						} else {
							associativeArray[response.data[i].from.name] = associativeArray[response.data[i].from.name] + 1;
						}
					}
					for (var key in associativeArray) {
						console.log(key);
						console.log(associativeArray[key]); 
					}
				}
				addHtml();
			}
			);
	}
	
	function addHtml() {
		document.getElementById('groupName').innerHTML = 'Top posters for ' + groupName;
		var html = "";
		for (var key in associativeArray) {
			html += '<li class="list-group-item"><span class="badge">' + associativeArray[key] + '</span>' + key + '</li>';
		}
		document.getElementById("namesList").innerHTML = html;
	}
}