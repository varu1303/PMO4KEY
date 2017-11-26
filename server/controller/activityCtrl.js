const activityLog = require('./../mongo/activityLog');

module.exports = {
    
    _newActivity: (name,empId,act) => {
        let activity = new activityLog({
                        byempId: empId,
                        byName: name,
                        activity: act
        });

        
        activity.save()
            .then(function(act) {
//                console.log('Activity saved ');
        })
            .catch(function(error) {
                console.log('Error in activity log ', error);
        })
    },
    
    _getFeed: () => {
        return activityLog.find({}).sort({"_id": -1});
    }
}   