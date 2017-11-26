angular.module('PMOapp')
    .service('tokenService', tokenService);

function tokenService($window, $http) {
    
    this.saveToken = function(token) {
        $window.localStorage['mean-token'] = token;
    };
    
    this.getPayload = function(token) {

        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        
        return payload;
    };
    
    this.getToken = function() {
        return $window.localStorage['mean-token'];
    };
    
    this.deleteToken = function() {
        $window.localStorage.removeItem('mean-token');
    };
    
    this.isAdmin = function() {
        var p = JSON.parse($window.atob($window.localStorage['mean-token'].split('.')[1]));
        return p.admin;
        
    };
    
    this.isLoggedIn = function() {
        if(!$window.localStorage['mean-token'])
            return false;
        
        return true;
    };
}