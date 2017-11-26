const User = require('./../controller/userCtrl');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const SECRETKEY = require('./../config/secret');
const genResponse = require('./../config/response');
const authenticatedUser = require('./../controller/authenticator');
const exportEmail = require('./../config/email-cred');
const activity = require('./../controller/activityCtrl');

module.exports = app => {

//User has to logged in to access few api
const isLoggedIn = (req,res,next) => {
    
        if(!req.get('authorization')){
            res.status(401).json(genResponse(null,'You have been logged out. Login please!'));
        }
        else{
            let decoded = authenticatedUser(User.getClientToken(req.get('authorization')));

            if(decoded) {

                req.EMPIDfromtoken = decoded.empId;
                req.ADMINfromtoken = decoded.admin;
                req.NAMEfromtoken = decoded.name;
                next();
            }else {
                res.status(401).json(genResponse(null,'Not an authorised user - LOGIN and try again'));
            }            
        }


};
    
//User is Admin or not
const isAdmin = (req,res,next) => {
    
    if(!req.ADMINfromtoken)
        res.status(401).json(genResponse(null,'Only Admins can read feed! - YOU ARE NOT AUTHORISED'));
    else
        next();


};
    

    
//IN CASE USER CANT LOGIN - FOLLOWING TWO FUNCTIONS HELP OUT
    
/* THIS PART CREATING NEW PASSWORD AND SENDING IT OVER IN EMAIL */
    
    function makeid() {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

          return text;
    }
    
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        auth: {
            user: exportEmail.id, // Your email id
            pass: exportEmail.password // Your password
        }
    });

    
    var emailSender = function(email) {
        
        return new Promise(function(resolve, reject){
            var newpass = makeid();
            var text = `Hey! Your new PASSWORD is : ${newpass}. Look for the lock icon in 'YOUR PROFILE' to change password!` 
            var mailOptions = {
                    from: exportEmail.id, // sender address
                    to: email, // list of receivers
                    subject: 'Password Change - KEY', // Subject line
                    text: text 
                };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    reject();

                }else{
                    resolve({
                        email: email,
                        pass: newpass
                    });
                }
            }); 
            
        });


    };
    
/* ----NODE MAILER ENDS HERE---- */
    
//REGISTER    
    app.post('/user/register',function(req,res) {
        
        let details = req.body.userDetails;
        let currDate = new Date();
        details.ctsDOJ = new Date(details.ctsDOJ);
        details.keyDOJ = new Date(details.keyDOJ);
        if(details.Visa.expiryDate)
            details.Visa.expiryDate = new Date(details.Visa.expiryDate);

        
        if(details.ctsDOJ > details.keyDOJ)
            res.status(400).json(genResponse(null,'CTS joining cannot be after Key joining!'));
        else if(details.ctsDOJ > currDate)
            res.status(400).json(genResponse(null,'CTS join date cannot be future dated!'));
        else if(details.keyDOJ > currDate) 
            res.status(400).json(genResponse(null,'KEY join date cannot be future dated!'));
        else{

            if(details.Visa.expiryDate){
                if(details.Visa.expiryDate < currDate)
                    res.status(400).json(genResponse(null,'Cannot add expired Visa!'));
                else{
                     User._logIn(req.body.userDetails) 
                        .then(function(user) {
                            if(user){
                                res.status(400).json(genResponse(null,'Employee ID already registered '));
                            }else{
                                User._saveNew(req.body.userDetails)
                                    .then(function(newUser) {
                                        activity._newActivity(newUser.name,newUser.empId,' has registered');
                                        res.json(genResponse(newUser.getPublicFields(),null));
                                })
                                    .catch(function(error) {

                                        res.status(400).json(genResponse(null,'E-mail and Phonenumber has to be unique for each user!'));
                                })
                            }
                    })
                        .catch(function(error) {
                            res.status(500).jsonp(genResponse(null,error));
                    })                           
                }                
            } else{
                     User._logIn(req.body.userDetails) 
                        .then(function(user) {
                            if(user){
                                res.status(400).json(genResponse(null,'Employee ID already registered '));
                            }else{
                                User._saveNew(req.body.userDetails)
                                    .then(function(newUser) {
                                        activity._newActivity(newUser.name,newUser.empId,' has registered');
                                        res.json(genResponse(newUser.getPublicFields(),null));
                                })
                                    .catch(function(error) {

                                        res.status(400).json(genResponse(null,'E-mail and Phonenumber has to be unique for each user!'));
                                })
                            }
                    })
                        .catch(function(error) {
                            res.status(500).jsonp(genResponse(null,error));
                    })                           
                }


        }
 


    });

    
//LOGIN
    app.post('/user/login',function(req,res) {
        let enteredPassword = req.body.userCredential.password;
        User._logIn(req.body.userCredential)
            .then(function(user) {
                if(!user)
                    res.status(404).json(genResponse(null,'Employee is not registered!'));
                else{
//COMPARING THE PASSWORD ENTERED
                    if(!enteredPassword){
                        res.status(401).json(genResponse(null,'Employee password is not provided!'));                     
                    }
                    else {
                        bcrypt.compare(enteredPassword, user.password, function(berr, bresponse) {
                            if(berr){
                                res.status(500).json(genResponse(null,'Error in crypting Password'));
                            } else{
                                if(bresponse){
                                    let token = jwt.sign(user.getPayload(), SECRETKEY);
                                    res.json(genResponse(token,null));
                                }else{
                                    res.status(401).json(genResponse(null,'Password is incorrect!'));
                                }
                            }
                        });                         
                    }
                  
                }

        })
            .catch(function(error) {
                res.status(500).json(genResponse(null,'Could not get user Logged in '));                
        })
    });
    
//COMPLETED MANDATORY LEARNINGS - Update DB -> No config data is required as we know it is one time update to true
    
    app.put('/user/mancomp', isLoggedIn, function(req,res) {
        User._updManComp(req.EMPIDfromtoken)
            .then(function(updatedUser) {
                activity._newActivity(updatedUser.name,updatedUser.empId,' completed mandatory e-learnings');
                let updatedtoken = jwt.sign(updatedUser.getPayload(), SECRETKEY);
                res.json(genResponse(updatedtoken,null));
        })
            .catch(function(error) {
                res.json(genResponse(null,'Mandatory status could not be updated'));
        })
    });
    
//UPDATE USER DETAILS - BY USER 
    app.put('/user/userPublicDetails', isLoggedIn, function(req,res) {
        
        if(!req.body.userDetail.Visa.expiryDate && req.body.userDetail.Visa.typ != 'NA')
            res.status(400).json(genResponse(null,'Need Expiration Date of Visa as well'));
        else if(new Date(req.body.userDetail.Visa.expiryDate) < new Date() && req.body.userDetail.Visa.typ != 'NA')
            res.status(400).json(genResponse(null,'Cannot add an expired Visa!'));
        else{
            User._updUserPublicDetails(req.EMPIDfromtoken,req.body.userDetail)
                .then(function(updatedUser) {
                    activity._newActivity(updatedUser.name,updatedUser.empId,' updated personal information');
                    let updatedtoken = jwt.sign(updatedUser.getPayload(), SECRETKEY);
                    res.json(genResponse(updatedtoken,null));
            })
                .catch(function(error) {
                    res.json(genResponse(null,'User Details could not be updated'));
            })
        }

    });
    
//CHANGE PASSWORD
    
    app.put('/user/changepass', isLoggedIn, function(req,res) {
        User._updUserPassFind(req.EMPIDfromtoken)
            .then(function(newUser) {
                User._updUserPassSave(newUser,req.body.newPass)
                    .then(function(finalUser) {
                        res.json(genResponse(finalUser.getPublicFields(),null));
                });
        })
            .catch(function(error) {
                res.json(genResponse(null,'User Password could not be updated'));
        })
    });
    
//FORGOT PASSWORD
    
    app.post('/user/forgotpass',function(req,res) {

        if(!req.body.empId){
            res.status(400).json(genResponse(null,'Please Provide EmpID'));
        }else{
            User._logIn(req.body)
                .then(function(user){
                    if(!user)
                        res.status(404).json(genResponse(null,'Employee ID is incorrect!'));
                    else{
//NODEMAILER START...........................
                        emailSender(user.emailId)
                            .then(function(d){
//                     SAVING NEW PASSWORD IN DB.........
                                User._updUserPassFind(req.body.empId)
                                    .then(function(u) {
                                        User._updUserPassSave(u,d.pass)
                                            .then(function(newU) {
                                                res.json(genResponse(newU.getPublicFields(),null));
                                        });
                                })
                                    .catch(function(error) {
                                        res.json(genResponse(null,'User Password could not be Created'));
                                })
//                     SAVED!!.........
                            
                        })
                            .catch(function(){
                                var result = myResponse.generate(true,'New Password could not be sent',502,null);
                                res.send(result); 
                        });
//NODEMAILER ENDS...........................
                    }
            })
                .catch(function(err) {
                    res.json(genResponse(null,'New Password could not be sent'));
            })
        }
    });
    
//ADMIN PATHS
    
//    app.post('/admin/login',function(req,res) {
//        
//        let enteredPassword = req.body.password;
//        User._logIn(req.body)
//            .then(function(user) {
//                if(!user)
//                    res.status(404).json(genResponse(null,'Employee ID is incorrect!'));
//                else{
////MAKING SURE USER IS AN ADMIN
//                    if(!user.admin)
//                        res.status(401).json(genResponse(null,'You are not an admin'));
//                    else{
////COMPARING THE PASSWORD ENTERED
//                        if(!enteredPassword){
//                            res.status(401).json(genResponse(null,'Employee password is not provided!'));                 
//                        }
//                        else {
//                            bcrypt.compare(enteredPassword, user.password, function(berr, bresponse) {
//                                if(berr){
//                                    res.status(500).json(genResponse(null,'Error in crypting Password'));
//                                } else{
//                                    if(bresponse){
//                                        let token = jwt.sign(user.getPayload('admin'), SECRETKEY);
//                                        res.json(genResponse(token,null));
//                                    }else{
//                                        res.status(401).json(genResponse(null,'Employee password is incorrect!'));
//                                    }
//                                }
//                            });                         
//                        }
//
//                    }
//                }
//
//        })
//            .catch(function(error) {
//                res.status(500).json(genResponse(null,'Could not get user Logged in '));                
//        })
//    });
    
    
//GET USER FEED FOR ADMIN- ONLY
    
    app.get('/admin/readfeed', isLoggedIn, isAdmin, function(req, res){

        activity._getFeed()
            .then(function(feed) {
                res.json(genResponse(feed,null));
        })
            .catch(function(error) {
                res.json(genResponse(null,error));
        });

    });
    
    app.get('/admin/getUser/:empId', isLoggedIn, isAdmin, function(req, res){

        User._getUser(req.params.empId)
            .then(function(user) {
                if(!user){
                    res.status(404).json(genResponse(null,'EMPLOYEE ID NOT FOUND IN KEY DATABASE!'))
                }else{
                    res.json(genResponse(user.getDetails4Admin(),null));
                }

        })
            .catch(function(error) {
                res.json(genResponse(null,'ERROR IN GETTING DETAILS.. TRY LATER.'));
        });

    });

    
//SIX REPORTS NDA BMS visa proj Drug Mand
    app.get('/admin/NDAreport', isLoggedIn, isAdmin, function(req,res) {
        
        User._getNDAN()
            .then(function(data) {
                res.json(genResponse(data,null))
        })
            .catch(function(error) {
            res.status(500).json(genResponse(null,'ERROR IN GETTING DATA FROM DATABASE'));
        })
    });
 

    app.get('/admin/BMSreport', isLoggedIn, isAdmin, function(req,res) {
        
        User._getBMSN()
            .then(function(data) {
                res.json(genResponse(data,null))
        })
            .catch(function(error) {
            res.status(500).json(genResponse(null,'ERROR IN GETTING DATA FROM DATABASE'));
        })
    });
    
    app.get('/admin/Drugreport', isLoggedIn, isAdmin, function(req,res) {
        
        User._getDTN()
            .then(function(data) {
                res.json(genResponse(data,null))
        })
            .catch(function(error) {
            res.status(500).json(genResponse(null,'ERROR IN GETTING DATA FROM DATABASE'));
        })
    });
    
    app.get('/admin/Mandreport', isLoggedIn, isAdmin, function(req,res) {
        
        User._getMand()
            .then(function(data) {
                res.json(genResponse(data,null))
        })
            .catch(function(error) {
            res.status(500).json(genResponse(null,'ERROR IN GETTING DATA FROM DATABASE'));
        })
    });
    
    app.get('/admin/visareport', isLoggedIn, isAdmin, function(req,res) {
        
        User._getvisa()
            .then(function(data) {
                res.json(genResponse(data,null))
        })
            .catch(function(error) {
            res.status(500).json(genResponse(null,'ERROR IN GETTING DATA FROM DATABASE'));
        })
    });
    
    app.get('/admin/projreport', isLoggedIn, isAdmin, function(req,res) {
        
        User._getproj()
            .then(function(data) {
                res.json(genResponse(data,null))
        })
            .catch(function(error) {
            res.status(500).json(genResponse(null,'ERROR IN GETTING DATA FROM DATABASE'));
        })
    });
    
//END OF SIX REPORTS
    
    app.put('/admin/makeadmin', isLoggedIn, isAdmin, function(req,res) {
        
        if(req.body.empId == req.EMPIDfromtoken){
            res.status(400).json(genResponse(null,'YOU ARE ALREADY AN ADMIN!')); 
        } else {
            User._makeAdmin(req.body.empId)
                .then(function(newAdmin) {
                    if(!newAdmin){
                        res.status(404).json(genResponse(null,'empId not found!'));
                    }else{
                        let t = ' has been granted ADMIN access!';
                        let text =  t +'-' +req.NAMEfromtoken+'('+req.EMPIDfromtoken+')';
                        activity._newActivity(newAdmin.name, newAdmin.empId, text);
                        res.json(genResponse(newAdmin.getPublicFields(),null));
                    }

            })
                .catch(function(error) {
                    res.status(500).json(genResponse(null,'ERROR IN UPDATING DB'));
            })
        }



    });
    
    
//UPDATING USERs PRIVATE DETAILS - ONLY BY AMIN
    
    app.put('/admin/updateUserProject', isLoggedIn, isAdmin, function(req,res) {

        User._updUserProject(req.body.newProject.empId,req.body.newProject.projectId,req.body.newProject.projectName)
            .then(function(updUser) {
                if(!updUser){
                    res.status(404).json(genResponse(null,'Employee Id not found!'));
                }else{
                    let text = ' is assigned to a new project '+'-' + req.NAMEfromtoken+'('+req.EMPIDfromtoken+')';
                    activity._newActivity(updUser.name,updUser.empId,text);
                    res.json(genResponse(updUser.getPublicFields(),null));
                }

        })
            .catch(function(error) {
                res.status(500).json(genResponse(null,'ERROR IN UPDATING DB'));
        });            
    });
    
    app.put('/admin/updateUserNDASign', isLoggedIn, isAdmin, function(req,res) {
        
        User._updUserNDASign(req.body.empId,req.body.NDASign)
            .then(function(updUser) {
                if(!updUser){
                    res.status(404).json(genResponse(null,'empId not found!'));
                }else{
                    let t = updUser.NDASign ? ' has signed NDA' : ' has not signed NDA '
                    let text = t +'-' +req.NAMEfromtoken+'('+req.EMPIDfromtoken+')';
                    activity._newActivity(updUser.name,updUser.empId,text);
                    res.json(genResponse(updUser.getPublicFields(),null));
                }

        })
            .catch(function(error) {
                res.status(500).json(genResponse(null,'ERROR IN UPDATING DB'));
        });            
    });
    
    app.put('/admin/updateUserBMSreq', isLoggedIn, isAdmin, function(req,res) {
        
        User._updUserBMSreq(req.body.empId,req.body.BMSreq)
            .then(function(updUser) {
                if(!updUser){
                    res.status(404).json(genResponse(null,'empId not found!'));
                }else{
                    let t = updUser.BMSreq ? ' has a BMS request in queue' : ' does not have a BMS request in queue ';
                    let text =  t +'-' +req.NAMEfromtoken+'('+req.EMPIDfromtoken+')';
                    activity._newActivity(updUser.name,updUser.empId,text);
                    res.json(genResponse(updUser.getPublicFields(),null));
                }

        })
            .catch(function(error) {
                res.status(500).json(genResponse(null,'ERROR IN UPDATING DB'));
        });            
    });
    
    app.put('/admin/updateUserdrugTest', isLoggedIn, isAdmin, function(req,res) {
        
        User._updUserdrugTest(req.body.empId,req.body.drugTest)
            .then(function(updUser) {
                if(!updUser){
                    res.status(404).json(genResponse(null,'empId not found!'));
                }else{
                    let t = updUser.drugTest ? ' has taken drug test.' : ' has not taken drug test. ';
                    let text =  t +'-' +req.NAMEfromtoken+'('+req.EMPIDfromtoken+')';
                    activity._newActivity(updUser.name,updUser.empId,text);
                    res.json(genResponse(updUser.getPublicFields(),null));
                }

        })
            .catch(function(error) {
                res.status(500).json(genResponse(null,'ERROR IN UPDATING DB'));
        });            
    });
    
    app.delete('/admin/deleteUser/:empId', isLoggedIn, isAdmin, function(req,res) { 
        
        if(req.params.empId == req.EMPIDfromtoken){
            res.status(400).json(genResponse(null,'CANNOT DELETE YOURSELF!')); 
        } else {
            User._deleteDoc(req.params.empId)
                .then(function(delUser) {

                    let t = ' DELETED!';
                    let text =  t +'-' +req.NAMEfromtoken+'('+req.EMPIDfromtoken+')';
                    activity._newActivity(delUser.name, req.params.empId, text);
                    res.json(genResponse(null,null));                    

            })
                .catch(function(error) {
                    res.status(500).json(genResponse(null,'ERROR IN DELETING'));            
            })
        }
        

    });
    
}









