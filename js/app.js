var server = window.location.protocol + "//" + window.location.host;
var serverWeb = window.location.protocol + "//" + window.location.host;

if (server == "http://10.16.1.1"){				//produzione da interno
	server = "http://10.16.1.1:8080"
}
else if (server.indexOf("http://127.0.0.1") >= 0 ){		//sviluppo da nms
	server = "http://localhost:8080"
}
else if (server == "http://10.206.84.170"){		//sviluppo da nms
	server = "http://10.206.84.170:8080"
}
else if (server == "http://localhost"){			//sviluppo da casa
	server = "http://localhost:8080"
}
else if (server == "http://192.168.122.1"){		//sviluppo da casa
	server = "http://192.168.122.1:8080"
}
else if (server == "http://217.220.17.147"){	//produzione da esterno
	server = "http://217.220.17.147:8080"
}
else if (server == "http://127.0.0.1"){			//sviluppo da casa
	server = "http://10.0.2.15:8080"
}
else {
	server = "http://indigo-gdecil.rhcloud.com"
}

var exp ;

var xApp = angular.module(
  'xApp', 
  [
    'ngRoute',
    'xControllers',
    'xDirectives',
    'xRuns',
    'schemaForm',
    'ui.ace'
  ]
);

xApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/search', {
        templateUrl: 'partials/Search.html',
        controller: 'searchCtrl'
      }).
      when('/view/:reactionId', {
        templateUrl: 'partials/View.html',
        controller: 'viewCtrl'
      }).
      when('/register/:reactionId', {
        templateUrl: 'partials/Register.html',
        controller: 'registerCtrl'
      }).
      otherwise({
        redirectTo: '/search'
      });
  }]);
