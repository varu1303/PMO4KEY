angular.module('PMOapp')
    .service('httpService',httpService);

function httpService($http, tokenService) {

    this._register = function (userDetails) {
        
        return $http.post('/user/register', {
            userDetails: userDetails
        });
    }
    
    this._login = function(userCredential) {
        return $http.post('/user/login', {
            userCredential: userCredential
        });
    }
    
    this._genNewPass = function (empId) {
        return $http.post('/user/forgotpass',{
            empId: empId
        });
    }
    
    this._updManComp = function (empId) {
        return  $http.put('/user/mancomp',{},{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._updUserPublicDetails = function (userDetail) {
        return $http.put('/user/userPublicDetails',{
            userDetail:userDetail
        },{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._getUser = function (empId) {
        return $http.get('/admin/getUser/'+ empId,{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._updNDA = function (empId, NDASign) {
        return $http.put('/admin/updateUserNDASign', {
            empId: empId,
            NDASign: NDASign
        },{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._updBMS = function (empId, BMSreq) {
        return $http.put('/admin/updateUserBMSreq', {
            empId: empId,
            BMSreq: BMSreq
        },{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._makeAdmin = function (empId) {
        return $http.put('/admin/makeadmin',{
            empId:empId
                },{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._getReport = function (type) {
        return  $http.get('/admin/'+type+'report',{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._getTotalAssociate = function () {
        return $http.get('/admin/countAssociate',{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._deleteUser = function (empId) {
        return $http.delete('/admin/deleteUser/'+ empId,{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._upddrug = function (empId, drugTest) {
        return $http.put('/admin/updateUserdrugTest', {
            empId: empId,
            drugTest: drugTest
        },{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._updProjectDetails = function (newProject) {
        return $http.put('/admin/updateUserProject',{
            newProject : newProject
        },{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._changePass = function(newPass) {
        return $http.put('/user/changepass', {
            newPass: newPass
        },{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
    this._getFeed = function() {
        return $http.get('/admin/readfeed',{
                                        headers: {Authorization: 'Bearer '+ tokenService.getToken()}
            });
    }
    
}