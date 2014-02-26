/**
 * ADCore
 *
 * @module      :: Service
 * @description :: This is handles the sync service for NextSteps Server

 *
 */
var $ = require('jquery');
var GMA = require('gma-api');

var syncFormat = {
    lastSyncTimestamp:1,
    appVersion:1,
    transactionLog:1,
    username:1,
    password:1
};


var paramsCorrect = function( req, format) {

    var correct = true;
    for (var f in format) {
        if (typeof req.param(f) == 'undefined') {
            correct = false;
            break;
        }
    }
    return correct;
}


module.exports = {
    synchronize: function (req, res) {
      var dfd = $.Deferred();
      if (!paramsCorrect(req, syncFormat) ) {
          dfd.reject({status:"required param not defined"});
      } else {
          // read In given Data
          var userID = req.param('username');
          var password = req.param('password');
          
          var guid = ADCore.auth.getAuth(req);
          
          
          // validateUser
          var validationDone = validateUser(guid);
          
          
          // setupGMA
          var setupDone = setupGMA(userID, password);
          
          
          $.when(validationDone, setupDone)
          .then(function(userData, gma){
    console.log('validation and setup done...');

              // getAssignments
              var assignmentsDone = getAssignments(gma);
              
              // getMeasurements
              var measurementsDone = getMeasurements(gma);
          
              
              $.when(assignmentsDone, measurementsDone)
              .then(function(){
    console.log('assignments and measurements done ...');             
                  
                  dfd.resolve({
                      "lastSyncTimestamp": 1234567890,
                      "transactionLog": [{
                          "operation": "create",
                          "model:": "Campus",
                          "multilingual": false,
                          "params": {
                              "uuid": "01234567890abcdef",
                              "language_code": "en",
                              "name": "UAH"
                          }
                      }]
                    });
                  
                  
              })
              .fail(function(err){
                  dfd.reject(err);
              });
              
              
          })
          .fail(function(err){
             
              // how to handle an error here?
              dfd.reject(err);
          });

          
          
          
          
      }
      
      return dfd;
    }
};



var validateUser = function( guid ) {
    var dfd = $.Deferred();
    
    console.log('validating user ... ');
    /// validate here:
    dfd.resolve();
    
    return dfd;
};



var setupGMA = function( username, password ) {
    var dfd = $.Deferred();
    console.log('setting up GMA .. ');
    /// setup here:
    dfd.resolve();
    
    return dfd;
};



var getAssignments = function( gma ) {
    var dfd = $.Deferred();
    console.log('getting assignments ');
    /*
    1.1 if Add
        insert CAMPUS[ UUID, nodeID ] 
        insert CampusTrans [ langCode, name ]
       else
    If update and name change -> update campusTrans[lang, name]
                -> for all users in userCampus with campus_uuid 
                    -> TransactionLog [user_uuid, timestamp, ….]
                

    1.2. -> user_campus[user_uuid, campus_uuid], translog[user, time stamp, ….]
        -> TransactionLog [user_uuid, timestamp, ….] 
     */
    dfd.resolve();
    
    return dfd;
};



var getMeasurements = function( gma ) {
    var dfd = $.Deferred();
    console.log('getting measuements ');
    /*
    2. gma.getMeasurement()
    Each and every measurement -> 
        if Add -> Step[uuid, mid] -> stepTrans [lang, name,    description]
            campusSteps[campus_uuid, step_uuid]
            -> for all users in user-campus with campus_uuid
                -> TransactionLog [user_uuid, timestamp, ….]
        else
        if udpate -> udpate stepTrans[lang, name, desc]
        -> for all users in user.campus with campus_uuid
            -> TransactionLog [user_uuid, timestamp, ….]

     */
    dfd.resolve();
    
    return dfd;
};

