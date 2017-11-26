angular.module('PMOapp')
    .controller('FeedController', FeedController);


function FeedController (tokenService, $rootScope, httpService) {
    
    var fc = this;

    fc.showyesterDay = false;
    fc.lastWeek = false;
    fc.lastMonth = false;
    
    if(!$rootScope.isName){
        var originalUser = tokenService.getPayload(tokenService.getToken());
        $rootScope.isAdmin = originalUser.admin;
        $rootScope.isName = originalUser.name;
    }
    
    httpService._getFeed()
        .then(function(data) {
            var activityList = data.data.data;
            fc.today = new Date();
            fc.yesterday = new Date() - 86400001;
            fc.lastweek = new Date() - 86400001*2;
            fc.lastmonth = new Date() - 86400001*9;
        
            fc.todayList = activityList.filter(function(v,i){
                return ((new Date() - new Date(v.when)) < 86400000)
            });
            fc.yesterdayList = activityList.filter(function(v,i){
                return ((new Date() - new Date(v.when)) > 86400000 && (new Date() - new Date(v.when)) < (2*86400000));
            });
            fc.lastweekList = activityList.filter(function(v,i){
                return ((new Date() - new Date(v.when)) > (2*86400000) && (new Date() - new Date(v.when)) < (9*86400000));
            });
            fc.lastmonthList = activityList.filter(function(v,i){
                return ((new Date() - new Date(v.when)) > (9*86400000) && (new Date() - new Date(v.when)) < (39*86400000));
            });
    })
        .catch(function(error) {
            console.log(error.data.error);
    })
    
    fc.addToShow = function() {
        fc.show += 10;
    }
    
    
    
}