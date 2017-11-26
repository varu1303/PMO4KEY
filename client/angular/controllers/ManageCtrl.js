angular.module('PMOapp')
    .controller('ManageController',ManageController);

function ManageController($rootScope, tokenService, httpService, $scope, $timeout) {

    if(!$rootScope.isName){
        var originalUser = tokenService.getPayload(tokenService.getToken());
        $rootScope.isAdmin = originalUser.admin;
        $rootScope.isName = originalUser.name;
    }
    
    $scope.Math = window.Math;
    
    const mc = this;
    
    mc.searchempId = '';
    mc.activity = '';
    mc.findStatus = 'Looking up.. Please Wait..';
    mc.findAttempt = false;
    mc.found = false;
    mc.associate = {};
    
    mc.projectUpdateAttempt = false;
    mc.projectUpdated = false;
    mc.projectUpdateMessage = 'Updating Project...';
    
    mc.NDAerror = false;
    mc.NDAupdated = false;
    mc.deleteErrorText = '';
    mc.adminErrorText = '';
    mc.BMSerror = false;
    mc.BMSupdated = false;
    mc.Drugerror = false;
    mc.Drugupdated = false;
    mc.adminEd = false;
    mc.deleted = false;
    mc.adminError = false;
    mc.deleteError = false;
    
    mc.makeSure = false;
    
    mc.findUser = function() {
        mc.findAttempt = true;
        if(!mc.searchempId){
            mc.findStatus = 'Please Provide an Emplyee ID';
        }else{
            httpService._getUser(mc.searchempId)
                .then(function(user) {
                    mc.found = true;
                    var u = user.data.data;
                    mc.associate.name = u.name;
                    mc.associate.emailId = u.emailId;
                    mc.associate.totExp = u.totExp;
                    mc.associate.Visa = u.Visa;
                    mc.associate.NDASign = u.NDASign.toString();
                    mc.associate.BMSreq = u.BMSreq.toString();
                    mc.associate.drugTest = u.drugTest.toString();
                    mc.associate.manComp = u.manComp;
                    mc.associate.ccaRole = u.ccaRole;
                    mc.associate.ctsDOJ = u.ctsDOJ;
                    mc.associate.phoneNumber = u.phoneNumber;
                    mc.associate.projectId = u.projectId;
                    mc.associate.projectName = u.projectName;

                    
            })
                .catch(function(error) {
                    mc.findStatus = error.data.error;
            });
        }

    }
    
    mc.updateProject = function () {
        mc.projectUpdateAttempt = true;
        var newProject = {
            empId: mc.searchempId, 
            projectId: mc.associate.projectId,
            projectName: mc.associate.projectName 
        };
        httpService._updProjectDetails(newProject)
            .then(function(user) {
                mc.projectUpdated = true;
                $timeout(function(){
                    mc.projectUpdateAttempt = false;
                    mc.projectUpdated = false;
                },1500);
        })
            .catch(function(error) {
                mc.projectUpdateMessage = error.data.error;
        })
    }
    
    mc.updateNDA = function () {
        
        httpService._updNDA(mc.searchempId, mc.associate.NDASign)
            .then(function(user) {
                mc.NDAupdated = true; 
                $timeout(function(){
                    mc.NDAupdated = false;
                },1500);
        })
            .catch(function(error) {
                mc.NDAerror = true;
                $timeout(function(){
                    mc.NDAerror = false;
                },1500);
        })
    }
    
    mc.updateBMS = function () {
        
        httpService._updBMS(mc.searchempId, mc.associate.BMSreq)
            .then(function(user) {
                mc.BMSupdated = true; 
                $timeout(function(){
                    mc.BMSupdated = false;
                },1500);
        })
            .catch(function(error) {
                mc.BMSerror = true; 
                $timeout(function(){
                    mc.BMSerror = false;
                },1500);
        })
    }
    
    mc.updateDrug = function () {
        
        httpService._upddrug(mc.searchempId, mc.associate.drugTest)
            .then(function(user) {
                mc.Drugupdated = true;
                $timeout(function(){
                    mc.Drugupdated = false;
                },1500);
        })
            .catch(function(error) {
                mc.Drugerror = true;
                $timeout(function(){
                    mc.Drugerror = false;
                },1500);
        })
    }
    
    mc.doAction = function() {
        if(mc.activity == 'a') {
            httpService._makeAdmin(mc.searchempId)
                .then(function(user) {
                    mc.adminEd = true;
                    mc.makeSure = false;
                    $timeout(function(){
                        mc.adminEd = false;
                    },1500);
            })
                .catch(function(error) {
                    mc.adminError = true;
                    mc.adminErrorText = error.data.error;
                    $timeout(function(){
                        mc.adminError = false;
                    mc.adminErrorText = '';
                    },1500);
            })
        } else if(mc.activity == 'd') {
            httpService._deleteUser(mc.searchempId)
                .then(function(user) {
                    mc.deleted = true;
                    mc.makeSure = false;
                    $timeout(function(){
                        mc.deleted = false;
                    },1500);
            })
                .catch(function(error) {
                    mc.deleteError = true;
                    mc.deleteErrorText = error.data.error;
                    $timeout(function(){
                        mc.deleteError = false;
                        mc.deleteErrorText = '';
                    },1500);
            })
        }
    }
    
    mc.makeDecision = function(act) {
        mc.activity = act;
        mc.makeSure = true;
    }
    
    mc.makeReset = function(act) {
        mc.activity = '';
        mc.makeSure = false;
    }
    
    mc.resetFind = function() {
        mc.associate = {};
        mc.searchempId = '';
        mc.activity = '';
        mc.deleteErrorText = '';
        mc.adminErrorText = '';
        mc.findStatus = 'Looking up.. Please Wait..';
        mc.findAttempt = false;
        mc.found = false;
        mc.makeSure = false;
        mc.projectUpdateAttempt = false;
        mc.projectUpdated = false;
        mc.projectUpdateMessage = 'Updating Project...';
        mc.adminEd = false;
        mc.deleted = false;
        mc.adminError = false;
        mc.deleteError = false;
    }
}