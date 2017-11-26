angular.module('PMOapp')
    .controller('ForgotController', ForgetController);


function ForgetController(httpService, $location, $timeout) {
    const fc = this;
    
    fc.empId = '';
    fc.mailSent = false;
    fc.mailAttempt = false;
    
    fc.sendMail = function () {
        
        fc.errorMail = 'Generating New Password..... Please Wait';
        fc.mailAttempt = true;
        
        httpService._genNewPass(fc.empId)
            .then(function(data) {
                fc.mailSent = true;
                fc.empEmail = data.data.data.emailId;
                $timeout(function(){
                    $location.path('/');
                }, 3000);
                
        })
            .catch(function(error){
                fc.errorMail = 'Sorry! New password could not be generated.';
                console.log(error);
        });
        
    }
}