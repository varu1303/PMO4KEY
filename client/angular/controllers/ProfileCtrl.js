angular.module('PMOapp')
    .controller('ProfileController',ProfileController);

function ProfileController(httpService, tokenService, $rootScope, $scope) {
    
    
    var originalUser = tokenService.getPayload(tokenService.getToken());
    $rootScope.isAdmin = originalUser.admin;
    $rootScope.isName = originalUser.name;
    $scope.Math = window.Math;
    const pc = this;
    
    pc.updateAttempt = false;
    pc.changeAttempt = false;
    pc.updated = false;
    pc.changed = false;
    pc.updating = false;
    pc.changing = false;
    pc.updateMessage = 'UPDATING....';
    pc.changeMessage = 'CHANGING....';
    pc.newPassword = '';
    pc.conNewPassword = '';
    
    pc.link1 = false;
    pc.link2 = false;
    pc.link3 = false;
    pc.compSession = false;
    
    pc.checkManComp = function (link) {

        pc[link.number] = true;
        
        if( pc.link1 && pc.link2 && pc.link3) {
                
            if(!originalUser.manComp){
                
                httpService._updManComp()
                    .then(function(data){
                        tokenService.deleteToken();
                        tokenService.saveToken(data.data.data);
                        var manCompUser = tokenService.getPayload(tokenService.getToken());
                        assign(manCompUser);
                        pc.compSession = true;
                })
                    .catch(function(error){
                        console.log(error);                  
                })

            }
        }
    }
    
    function assign(user) {
        pc.empId = user.empId;
        pc.newEmail = user.emailId;
        pc.newccaRole = user.ccaRole;
        pc.newNumber =  user.phoneNumber;
        pc.newVisa = {};
        pc.newVisa.visaType = user.Visa.typ;
        if(user.Visa.expiryDate)
            user.Visa.expiryDate = new Date(user.Visa.expiryDate);
        pc.newVisa.expiryDate = user.Visa.expiryDate;

        pc.name = user.name;
        pc.empId = user.empId;
        pc.emailId = user.emailId;
        pc.manComp = user.manComp;
        pc.ccaRole = user.ccaRole;
        pc.phoneNumber =  user.phoneNumber;
        pc.totExp = user.totExp;
        pc.ctsDOJ = user.ctsDOJ;
        pc.Visa = {};
        pc.Visa.type = user.Visa.typ;
        pc.Visa.expiryDate = user.Visa.expiryDate;
    }
    
    
    assign(originalUser);

    
    pc.resetExpiry = function() {
        if (pc.newVisa.visaType == 'NA'){
            pc.newVisa.expiryDate = null;
        }
    }
    
    pc.updUserPublicDetails = function() {
        
        pc.updating = true;       
        pc.updateAttempt = true;
        
        var userDetails = {
            emailId: pc.newEmail,
            phoneNumber: pc.newNumber,
            ccaRole: pc.newccaRole,
            Visa : {
                    typ: pc.newVisa.visaType,
                    expiryDate: pc.newVisa.expiryDate 
            }
        }
        httpService._updUserPublicDetails(userDetails)
            .then(function(data) {
                pc.updating = false; 
                pc.updated = true;
                tokenService.deleteToken();
                tokenService.saveToken(data.data.data);
                var updatedUser = tokenService.getPayload(tokenService.getToken());
                assign(updatedUser);
        })
            .catch(function(error) {
                pc.updating = false; 
                pc.updated = false;
                pc.updateMessage = error.data.error;
        })
    }
    
    pc.resetModal = function() {
        pc.updateAttempt = false;
        pc.updated = false;
        pc.updating = false;
        pc.updateMessage = 'UPDATING....';
    }
    
    pc.resetPasswordModal = function() {
        pc.changeAttempt = false;
        pc.changed = false;
        pc.changin = false;
        pc.changeMessage = 'CHANGING....';
        pc.newPassword = '';
        pc.conNewPassword = '';
    }
    
    pc.changePassword = function() {
        
        pc.changeAttempt = true;
        if(pc.newPassword != pc.conNewPassword)
            pc.changeMessage = 'PASSWORDS NOT CONFIRMED';
        else if(pc.newPassword.length < 6 || pc.newPassword.length > 10)
            pc.changeMessage = 'PASSWORD NEED TO BETWEEN 6 and 10 CHARACTERS';
        else{
            pc.changing = true;

            httpService._changePass(pc.newPassword)
                .then(function(data){
                    pc.changing = false;
                    pc.changed = true;
            })
                .catch(function(error){
                    pc.changing = false;
                    pc.changeMessage = error.data.error;
            })
        }

    }
    
}




















