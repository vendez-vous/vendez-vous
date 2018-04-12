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
	db = client.db('vendez-vous-users') // whatever your database name is
	console.log('connected to mongodb')
	app.listen(3702, () => {
		console.log('listening on 3702')
		})
	})

app.get('/', function(req, res) {
	res.send('vendez-vous api - v:1.0')
	})
