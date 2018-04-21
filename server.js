/**
 *	vendez-vous api for backend
 *
 * @author: parth_shel
 * @version: v:1.0 Apr 11, 2018
 **/

console.log('vendez-vous server started')

const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}))

var db

MongoClient.connect('mongodb://api:cs252lab6@ds119618.mlab.com:19618/vendez-vous-users', (err, client) => {
  if (err) return console.log(err)
  db = client.db('vendez-vous-users')
  console.log('connected to mongodb')
  app.listen(3702, () => {
    console.log('listening on 3702')
  })
})

app.get('/', function(req, res) {
  res.send('vendez-vous api')
});

app.post('/user-login', (req, res) => {
  var user = {
    "_id": req.body.id,
    "user_name": req.body.name,
    "picture": req.body.picture /*.data.url*/ ,
    "location": {},
    "bio": "",
    "interests": "",
    "matches": []
  };
  // check if exists
  db.collection('users').findOne({
    "_id": user._id
  }, function(err, result) {
    if (err) console.log(err);
    else {
      if (result) {
        res.send("user exists!");
        console.log("user exists in the database");
      } else {
        // add to database
        db.collection('users').save(user, (err, result) => {
          if (err) console.log(err);
          else {
            console.log('saved to database');
            res.send("user logged in!");
          }
        });
      }
    }
  });
});

app.post('/update-profile', (req, res) => {
  var user = {
    "_id": req.body.id,
    "bio": req.body.bio,
    "interests": req.body.interests
  };
  // check if exists
  db.collection('users').findOne({
    "_id": user._id
  }, function(err, result) {
    if (err) console.log(err);
    else {
      if (result) {
        // update database
        db.collection('users').update({
          "_id": req.body.id
        }, {
          $set: {
            "bio": user.bio,
            "interests": user.interests
          }
        }, {
          w: 1
        }, (err, result) => {
          if (err) console.log(err);
          else {
            console.log('updated database');
            res.send("user profile updated");
          }
        });
      } else {
        res.send("user does not exist!");
        console.log("user does not exist in the database");
      }
    }
  });
});

app.post('/send-location', (req, res) => {
  var user = {
    "_id": req.body.id,
    "location": req.body.position
  };
  // check if exists
  db.collection('users').findOne({
    "_id": user._id
  }, function(err, result) {
    if (err) console.log(err);
    else {
      if (result) {
        // update database
        db.collection('users').update({
          "_id": user._id
        }, {
          $set: {
            "location": user.location
          }
        }, {
          w: 1
        }, (err, result) => {
          if (err) console.log(err);
          else {
            console.log('updated database');
            res.send("user location updated");
          }
        });
      } else {
        res.send("user does not exist!");
        console.log("user does not exist in the database");
      }
    }
  });
});

app.post('/like', (req, res) => {
  var user = {
    "_id": req.body.id,
    "other_user": req.body.other
  };
  // check if exists
  db.collection('users').findOne({
    "_id": user.other_user
  }, function(err, result) {
    if (err) console.log(err);
    else {
      if (result) {
        // update database
        var matches_copy = result.matches.slice()
        matches_copy.push(user._id);
        db.collection('users').update({
          "_id": user.other_user
        }, {
          $set: {
            // TODO append to the array of matches:
            "matches": matches_copy
          }
        }, {
          w: 1
        }, (err, result) => {
          if (err) console.log(err);
          else {
            console.log('updated database');
            res.send("liked! ;)");
          }
        });
      } else {
        res.send("this user does not exist!");
        console.log("user does not exist in the database");
      }
    }
  });
});

app.get('/get-nearby', (req, res) => {
  // console.log(req);
  var user = {
    "_id": req.headers.id
  };
  // check if exists
  db.collection('users').findOne({
    "_id": user._id
  }, function(err, result) {
    if (err) console.log(err);
    else {
      if (result) {
        // TODO get nearby users and if the 2 users have matched
        // console.log(result)
        var users_list = []
        db.collection('users').find().forEach(function(doc) {
          // console.log(doc)
          if (isNearby(doc, result) /*&& doc._id != result._id*/ ) {
            console.log(doc)
            var toSend = {
              "id": doc._id,
              "user_name": doc.user_name,
              "picture": doc.picture,
              "bio": doc.bio,
              "interests": doc.interests,
              "match": false
            };
            if (result.matches.includes(doc._id) && doc.matches.includes(result._id)) {
              toSend.match = true
            }

            users_list.push(toSend);
          }
        });
        console.log('response sent');
        if (users_list.length > 0) {
          res.send(users_list);
        } else {
          res.send('sorry nobody\'s using the app near you')
        }
      } else {
        res.send("this user does not exist!");
        console.log("user does not exist in the database");
      }
    }
  });
});

function isNearby(user1, user2) {
  console.log(user1.location);
  console.log(user2.location);
  console.log(distance(parseFloat(user1.location.latitude), parseFloat(user1.location.longitude), parseFloat(user2.location.latitude), parseFloat(user2.location.longitude)));
  if (distance(user1.location.latitude, user1.location.longitude, user2.location.latitude, user2.location.longitude) <= 5) { // 5 mile radius
    return true
  }
  return false
}

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1 / 180
  var radlat2 = Math.PI * lat2 / 180
  var theta = lon1 - lon2
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  if (unit == "K") {
    dist = dist * 1.609344
  }
  if (unit == "N") {
    dist = dist * 0.8684
  }
  return dist
}
