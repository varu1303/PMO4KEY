const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actLogSchema = new Schema({
    byName: {
        type: String
    },
    byempId: {
        type: String
    },
    activity: {
            type: String
        },
    when: {
        type: Date,
        default: new Date()
    }

});


const activityLog = mongoose.model('activityLog',actLogSchema);

module.exports = activityLog;
