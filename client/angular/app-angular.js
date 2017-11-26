angular.module('PMOapp',['ngRoute','ngAnimate'])
    .controller('MainController', MainController);



function MainController($location, tokenService) {
    var mc = this;
    
    mc.atLoc = function (home,forgot) {

        if (home == $location.path() || forgot == $location.path()){
            return true;
        }
    }

    
    mc.atLocClass = function (currLoc) {
        return currLoc == $location.path();
    }

}
