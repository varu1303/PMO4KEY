angular.module('PMOapp')
    .controller('OutController',OutController);

function OutController($timeout, $location, tokenService) {

    tokenService.deleteToken();
    
    $timeout(function() {
        $location.path('/');
    },1000);
}