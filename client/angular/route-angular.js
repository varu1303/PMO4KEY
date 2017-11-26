angular.module('PMOapp')
    .config(function($routeProvider,$locationProvider) {
    $routeProvider
		.when('/', {
			templateUrl: 'templates/log.html',
			controller: 'LogController',
            controllerAs: 'Log'
		})
		.when('/profile', {
			templateUrl: 'templates/profile.html',
			controller: 'ProfileController',
            controllerAs: 'Profile'
		})
        .when('/logout', {
			templateUrl: 'templates/logout.html',
			controller: 'OutController',
            controllerAs: 'Out'
		})
        .when('/feed', {
			templateUrl: 'templates/feed.html',
			controller: 'FeedController',
            controllerAs: 'Feed'
		})
        .when('/reports/:type', {
			templateUrl: 'templates/reports.html',
			controller: 'ReportController',
            controllerAs: 'Report'
		})
        .when('/manage', {
			templateUrl: 'templates/manage.html',
			controller: 'ManageController',
            controllerAs: 'Manage'
		})
        .when('/forgotpassword', {
			templateUrl: 'templates/forgot.html',
			controller: 'ForgotController',
            controllerAs: 'Forgot'
		})
		.otherwise({
			redirectTo: '/'
		});

//To make the URLs pretty (getting rid of #)
    $locationProvider.html5Mode(true);
    
    })

    .run(function($rootScope, $location, tokenService) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
          
        if ($location.path() !== '/' && !tokenService.isLoggedIn()) {
            if($location.path() == '/forgotpassword')
                $location.path('/forgotpassword')
            else
                $location.path('/');
        }
        
        if ($location.path() == '/feed' && tokenService.isLoggedIn() && !tokenService.isAdmin()) {
            $location.path('/profile');
        }
            
        if ($location.path() == '/manage' && tokenService.isLoggedIn() && !tokenService.isAdmin()) {
            $location.path('/profile');
        }
            
        if($location.path() == '/' && tokenService.isLoggedIn() ){
            $location.path('/profile');
        }
            
        if($location.path() == '/forgotpassword' && tokenService.isLoggedIn() ){
            $location.path('/profile');
        }
    });
    
});