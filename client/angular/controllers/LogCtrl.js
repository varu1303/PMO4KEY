angular.module('PMOapp')
    .controller('LogController',LogController);

function LogController(httpService, $timeout, $scope, $location, tokenService) {
    const lc = this;
    
    
    lc.userDetails = {};
    lc.userCredential = {};
    lc.cantRegister = false;
    lc.registered = false;
    lc.registerAttempt = false;
    lc.login = false;
    lc.loginAttempt = false;
    lc.errorInLogin = '';
    lc.errorInLogin = '';
    lc.logged = false;

    
    lc.loginUser = function() {
        lc.loginAttempt = true;
        
        if(!lc.userCredential.empId || !lc.userCredential.password){
            lc.errorInLogin = 'Provide Credentials!';
        }else {
            lc.errorInLogin = 'Logging in...';
            httpService._login(lc.userCredential)
                .then(function(token) {
                    lc.errorInLogin = '';
                    lc.login = true;
                    lc.logged = true;
                    $timeout(function(){
                        $location.path('/profile');
                    },1000);
                    tokenService.saveToken(token.data.data);
            })
                .catch(function(error) {
                    lc.errorInLogin = error.data.error;
            })           
        }

    }
    
    lc.clearExpiryifNA = function() {
        if (lc.userDetails.Visa.visaType == 'NA')
            lc.userDetails.Visa.expiryDate = null;
    }
    
    lc.registerUser = function(formInvalid) {

        if(formInvalid || lc.userDetails.password != lc.userDetails.conpassword || (lc.userDetails.Visa.visaType != 'NA' && lc.userDetails.Visa.expiryDate == null))
            lc.cantRegister = true;
        else{
            lc.registerAttempt = true;
            lc.errorInRegister = 'Registering....';
            lc.cantRegister = false;
            httpService._register(lc.userDetails)
                .then(function(data) {
                    lc.errorInRegister = '';
                    lc.registered = true;                    
                    $timeout(function(){
                        lc.registered = false;
                        lc.registerAttempt = false;
                        lc.userDetails = {};
                        lc.userDetails.Visa= {visaType : 'NA'};
                        if ($scope.registerForm) { $scope.registerForm.$setPristine()};
                        angular.element('#login-form-link').trigger('click');
                    },1000);

            })
                .catch(function(error) {
                    lc.registered = false;
                    lc.errorInRegister = error.data.error;
            })
            
        }
    }
    
    function _init() {
        lc.userDetails.Visa= {visaType : 'NA'};
        lc.userCredential.empId = '';
        lc.userCredential.password = '';
    }
    _init();
}
