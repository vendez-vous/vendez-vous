/** 
 *	vendez-vous api for backend
 * 
 * @author: parth_shel
 * @version: v:1.0 Apr 11, 2018
**/

console.log('vendez-vous server started')

const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

app.use(bodyParser.urlencoded({extended: true}))

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
	console.log(req);
	var user = {
		"_id": req.body.id,
		"user_name": req.body.name,
		"picture": req.picture.data.url,
		"location": {},
		"bio": "",
		"interests": "",
		"matches": []
	};
	// check if exists first 
	db.collection('users').findOne({"_id": user._id}, function (err, result) {
			if(err) console.log(err)
			else {
				if (result) {
					res.send("user exists!");
					}
				else {
					// add to database
					db.collection('users').save(user, (err, result) => {
					if (err) console.log(err)
					else {
						console.log('saved to database')
						res.send("user logged in!")
						}
					})
				})
			}
		}
	});


