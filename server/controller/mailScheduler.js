const cron = require('node-cron');
const User = require('./userCtrl');
const exportEmail = require('./../config/email-cred');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    auth: {
        user: exportEmail.id, // Your email id
        pass: exportEmail.password // Your password
    }
});

cron.schedule('30 12 * * Wed', function(){
    
    User._getDTN()
        .then(function(data){
            if(data.length > 0){
                data.forEach(function(v,i) {
//                    console.log('Send Email to DTN', v.emailId);
//                    var newpass = makeid();
                    var text = `Hi! Your Drug Test is Pending, Kindly reach out to PMO team.` ;
                    var mailOptions = {
                            from: exportEmail.id, // sender address
                            to: v.emailId, // list of receivers
                            subject: 'Drug Test Pending', // Subject line
                            text: text 
                        };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                        }
                    });
                })
            }
    })
    
    User._getNDAN()
        .then(function(data){
            if(data.length > 0){
                data.forEach(function(v,i) {
                    var text = `Hi! Your NDA Signing is Pending, Kindly reach out to PMO team.` ;
                    var mailOptions = {
                            from: exportEmail.id, // sender address
                            to: v.emailId, // list of receivers
                            subject: 'NDA Signing Pending', // Subject line
                            text: text 
                        };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                        }
                    });
                })                   
            }
    })
    
    User._getBMSN()
        .then(function(data){
            if(data.length > 0){
                data.forEach(function(v,i) {
                    var text = `Hi! Your BMS request is Pending, Kindly reach out to PMO team.` ;
                    var mailOptions = {
                            from: exportEmail.id, // sender address
                            to: v.emailId, // list of receivers
                            subject: 'BMS Request Pending', // Subject line
                            text: text 
                        };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                        }
                    });                   
                })
            }
    })
    
    User._getMand()
        .then(function(data){
            if(data.length > 0){
                data.forEach(function(v,i) {
                    var text = `Hi! Your Mandatory Assessments are incomplete. Please complete them.` ;
                    var mailOptions = {
                            from: exportEmail.id, // sender address
                            to: v.emailId, // list of receivers
                            subject: 'Mandatory Assessments Incomplete', // Subject line
                            text: text 
                        };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                        }
                    });                   
                })
            }
    })
});