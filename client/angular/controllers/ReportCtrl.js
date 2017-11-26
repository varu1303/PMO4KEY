angular.module('PMOapp')
    .controller('ReportController',ReportController);

function ReportController($rootScope, tokenService, $routeParams, $location, httpService, $timeout, $route) {

    if(!$rootScope.isName){
        var originalUser = tokenService.getPayload(tokenService.getToken());
        $rootScope.isAdmin = originalUser.admin;
        $rootScope.isName = originalUser.name;
    }
    const rc = this;
    rc.checkedList = [];
    rc.updReq = [];
    rc.Authorised = true;
    rc.noSelection = false;
    rc.bulkDoing = false;
    rc.bulkError = false;
    rc.reportError = false;
    if(!$rootScope.isAdmin){
        rc.Authorised = false;
        $location.path('/profile');
    }    

    
    if(rc.Authorised){
        if($routeParams.type == 'NDA' || $routeParams.type == 'BMS' || $routeParams.type == 'Drug' || $routeParams.type == 'visa' || $routeParams.type == 'proj' || $routeParams.type == 'Mand' )
            {
                if($routeParams.type == 'NDA')
                    rc.description = 'Associates who have not signed NDA';
                else if($routeParams.type == 'BMS')
                    rc.description = 'BMS request is pending for these Associates';
                else if($routeParams.type == 'visa')
                    rc.description = 'Associates with valid Visa.';
                else if($routeParams.type == 'Drug')
                    rc.description = 'Associates who are yet to take the Drug test.';
                else if($routeParams.type == 'Mand')
                    rc.description = 'Associates who have not completed their Mandatory assessments';
                else if($routeParams.type == 'proj')
                    rc.description = 'Associates who do not have a project';
                

                
                httpService._getReport($routeParams.type)
                    .then(function(data){
                        let a = data.data.data;
                        a.forEach(function(v, i) {
                            v.SELECTED = 'N';
                        })
                        rc.displayArray = a;
                })
                    .catch(function(error){
                        rc.reportError = true;
                        console.log(error.data.error);
                })
            }
        else{
            rc.Authorised = false;
            $location.path('/manage');
        }
    }
    
    rc.checkType = function () {
        if($routeParams.type == 'NDA' || $routeParams.type == 'BMS' || $routeParams.type == 'Drug')
            return true;
        else
            return false;
    }
    
    rc.accumEmp = function (emp) {

        emp.forEach(function(v,i) {
            if(v.SELECTED == 'Y') {
                if(rc.checkedList.indexOf(v.empId) == -1)
                    rc.checkedList.push(v.empId);
            }else{
                if(rc.checkedList.indexOf(v.empId) != -1){
                    var x = rc.checkedList.indexOf(v.empId);
                    rc.checkedList.splice(x,1);                    
                }               
            }
        })
                    
        var req;
        if($routeParams.type == 'NDA')
            req = httpService._updNDA;
        else if($routeParams.type == 'BMS')
            req = httpService._updBMS;
        else if($routeParams.type == 'Drug')
            req = httpService._upddrug;


            
        if(rc.checkedList.length > 0) { 
            var updReq = [];
            rc.bulkDoing = true;
            updReq = rc.checkedList.map(function(v,i){
                return req(v,true);
            })

            Promise.all(updReq)
                .then(function(d) {
                    $timeout(function(){
                        $route.reload();
                    },1500);
            })
                .catch(function(e){
                    rc.bulError = true;
                    rc.bulkDoing = false;
                    console.log(e);
            });
            
        } else {
            rc.noSelection = true;
            $timeout(function(){
                rc.noSelection = false;
            },2000);
        }
    }
}