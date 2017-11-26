const mongoose = require('mongoose');
//const activityLog = require('./activityLog');
const bcrypt = require('bcrypt');
const saltRounds = 13;
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    empId: {
        type: String,
        unique: true,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    ccaRole: {
        type: String,
        required: true
    },
    ctsDOJ: {
        type: Date
//        required: true
    },
    keyDOJ: {
        type: Date
//        required: true
    },
    expb4CTS: {
        type: Number
//        required: true
    },
    totExp: {
        type: Number
    },
    manComp: {
        type: Boolean,
        default: true
    },
    Visa: {
            typ: {type: 'String'},
            expiryDate: {type: 'Date'}
        }
    ,
    admin: {
        type: Boolean,
        default: false
    },
//FIELDS ONLY VISIBLE AND CONTROLLED BY ADMIN
    NDASign: {
        type: Boolean,
        default:true
    },
    drugTest: {
        type: Boolean,
        default:true
    },
    BMSreq: {
        type: Boolean,
        default:true
    },
    projectName: {
        type: String,
        default: null
    },
    projectId: {
        type: String,
        default: null
    }
});

userSchema.methods.getPublicFields = function () {
    let publicFields = {
        name: this.name,
        emailId: this.emailId,
        empId: this.empId,
        phoneNumber: this.phoneNumber,
        ccaRole: this.ccaRole,
        totExp: this.totExp,
        manComp: this.manComp
    };
    return publicFields;
};

userSchema.methods.getDetails4Admin = function () {
    let allFields = {
        name: this.name,
        emailId: this.emailId,
        empId: this.empId,
        phoneNumber: this.phoneNumber,
        ccaRole: this.ccaRole,
        totExp: this.totExp,
        manComp: this.manComp,
        projectName: this.projectName,
        projectId: this.projectId,
        NDASign: this.NDASign,
        BMSreq: this.BMSreq,
        drugTest: this.drugTest,
        Visa: this.Visa,
        ctsDOJ: this.ctsDOJ
    };
    return allFields;
};

userSchema.methods.getPayload = function () {
    let payload = {
        name: this.name,
        emailId: this.emailId,
        empId: this.empId,
        phoneNumber: this.phoneNumber,
        ccaRole: this.ccaRole,
        totExp: this.totExp,
        keyDOJ: this.keyDOJ,
        ctsDOJ: this.ctsDOJ,
        manComp: this.manComp,
        admin: this.admin,
        Visa: {
            typ: this.Visa.typ,
            expiryDate: this.Visa.expiryDate
        }
    };
    return payload;
};


userSchema.pre('save', function (next) {
    
    var u = this;

//    this.keyDOJ = new Date();
//    if(this.ctsDOJ - new Date('2017/10/31') > 2629746000);
//    this.NDASign = true;
//    this.drugTest = true;
//    this.BMSreq = true;
//    this.totExp = (this.expb4CTS * 2629746000) + (this.ctsDOJ - new Date()) / 2629746000;
//    if (u.isModified('keyDOJ')){
//        if(u.keyDOJ - new Date('2017/10/01') > 2629746000){
//            u.NDASign = false;
//            u.drugTest = false;
//            u.BMSreq = false;
//        }
//    }
    
//    // only hash the password if it has been modified (or is new)
//    if (!u.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
        bcrypt.hash(u.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            u.password = hash;
// 
//EVALUATING VALUES OF experience etc only at the time of document creation
            if (!u.isNew) return next()

            u.totExp = Math.floor(u.expb4CTS + ((new Date() -  u.ctsDOJ) / 2629746000));


            if((u.keyDOJ - new Date('2017/10/01')) > 2629746000){
                u.NDASign = false;
                u.drugTest = false;
                u.BMSreq = false;
                u.manComp = false;
            }

            next();
        })
    })
    






});

const User = mongoose.model('User', userSchema);





module.exports = User;
















