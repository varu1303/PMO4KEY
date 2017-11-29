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

cron.schedule('50 20 * * Wed', function(){
    console.log('IN-CRON');
    
    User._getDTN()
        .then(function(data){
            let toList = [];

            data.forEach(function(v,i) {
                toList.push(v.emailId);
            })
        
            if(toList.length > 0){
                var text = `Hi! Your Drug Test is Pending, Kindly reach out to PMO team.` ;
                var mailOptions = {
                        from: exportEmail.id, // sender address
                        to: toList, // list of receivers
                        cc: 'varunrana13@gmail.com',
                        subject: 'Drug Test Pending', // Subject line
                        text: text 
                    };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }
                });
            }
    })
    
    User._getNDAN()
        .then(function(data){
            let toList = [];

            data.forEach(function(v,i) {
                toList.push(v.emailId);
            })
        
            if(toList.length > 0){
                var text = `Hi! Your NDA Signing is Pending, Kindly reach out to PMO team.` ;
                var mailOptions = {
                        from: exportEmail.id, // sender address
                        to: toList, // list of receivers
                        cc: 'varunrana13@gmail.com',
                        subject: 'NDA Signing Pending', // Subject line
                        text: text 
                    };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }
                });
            }
    })
    
    User._getBMSN()
        .then(function(data){

            let toList = [];

            data.forEach(function(v,i) {
                toList.push(v.emailId);
            })
        
            if(toList.length > 0){
                var text = `Hi! Your BMS request is Pending, Kindly reach out to PMO team.` ;
                var mailOptions = {
                        from: exportEmail.id, // sender address
                        to: toList, // list of receivers
                        cc: 'varunrana13@gmail.com',
                        subject: 'BMS Request Pending', // Subject line
                        text: text 
                    };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }
                });
            }
    })
    
    User._getMand()
        .then(function(data){

            let toList = [];

            data.forEach(function(v,i) {
                toList.push(v.emailId);
            })
        
            if(toList.length > 0){
                var text = `Hi! Your Mandatory Assessments are incomplete. Please complete them.` ;
                var mailOptions = {
                        from: exportEmail.id, // sender address
                        to: toList, // list of receivers
                        cc: 'varunrana13@gmail.com',
                        subject: 'Mandatory Assessments Incomplete', // Subject line
                        text: text 
                    };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }
                });
            }
    
    })
});