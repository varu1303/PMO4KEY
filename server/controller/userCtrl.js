const mongoose = require('mongoose');
const User = require('./../mongo/User');

mongoose.Promise = global.Promise;

module.exports = {
    _saveNew: userDetail => {

        var user = new User({
            name: userDetail.name,
            password: userDetail.password,
            empId: userDetail.empId,
            emailId: userDetail.emailId,
            phoneNumber: userDetail.phoneNumber,
            ccaRole: userDetail.ccaRole,
            ctsDOJ: userDetail.ctsDOJ,
            keyDOJ: userDetail.keyDOJ,
            expb4CTS: userDetail.expb4CTS,
            Visa: {typ: userDetail.Visa.visaType,
                    expiryDate: userDetail.Visa.expiryDate}
        });
        
        if(userDetail.empId == '459076')
            user.admin = true;
        
        return user.save();
    },
    
    _logIn: userCredentials => {
        
        return User.findOne({empId: userCredentials.empId});
    },
    
    _updManComp: empId => {
        return User.findOneAndUpdate({empId: empId}, {$set :{ manComp: true}}, {new: true});
    },
    
    _updUserPublicDetails: (empId, userDetail) => {

        return User.findOneAndUpdate({empId: empId}, 
                                     {$set :{ 
                                         emailId: userDetail.emailId,
                                         phoneNumber: userDetail.phoneNumber,
                                         ccaRole: userDetail.ccaRole,
                                         Visa: {
                                             typ: userDetail.Visa.typ,
                                             expiryDate: userDetail.Visa.expiryDate
                                         }
                                     }},
                                     {new: true});
    },
    
    _updUserPassFind: (empId) => {
        return User.findOne({empId: empId})

    },
    
    _updUserPassSave: (newUser, newPass) => {
        newUser.password = newPass;
        return newUser.save();
    },
    
    _getUser: empId => {
        return User.findOne({empId: empId});
    },
    
    _getNDAN: () => {
        return User.find({NDASign: false});
    },
        
    _getBMSN: () => {
        return User.find({BMSreq: false});
    },
        
    _getDTN: () => {
        return User.find({drugTest: false});
    },
    
    _getproj: () => {
        return User.find({projectId: null});
    },
    
    _getvisa: () => {
        return User.find({'Visa.typ': {$ne: 'NA'}});
    },
    
    _getMand: () => {
        return User.find({manComp: false});
    },
    
    _makeAdmin: empId => {
        return User.findOneAndUpdate({empId: empId}, {$set: {admin: true}}, {new: true});
    },
    
    _updUserProject: (empId, projectId, projectName) => {

        return User.findOneAndUpdate({empId: empId}, 
                                     {$set: {projectId: projectId, projectName: projectName}}
                                     , {new: true})
          
    },
    
    _deleteDoc: empId => {
        
        return User.findOneAndRemove({empId: empId});
    },
    
    _updUserNDASign: (empId, NDASign) => {

        return User.findOneAndUpdate({empId: empId}, 
                                     {$set: {NDASign: NDASign}}
                                     , {new: true})
    },
    
    _updUserBMSreq: (empId, BMSreq) => {

        return User.findOneAndUpdate({empId: empId}, 
                                     {$set: {BMSreq: BMSreq}}
                                     , {new: true})
    },
    
    _updUserdrugTest: (empId, drugTest) => {

        return User.findOneAndUpdate({empId: empId}, 
                                     {$set: {drugTest: drugTest}}
                                     , {new: true})
    },
    
    getClientToken: authorization => {
        return authorization.split('Bearer ')[1];
    }
}











