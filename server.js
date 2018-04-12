console.log('vendez-vous')
const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended: true}))

var db

MongoClient.connect('mongodb://api:cs252lab6@ds119618.mlab.com:19618/vendez-vous-users', (err, client) => {
	if (err) return console.log(err)
	db = client.db('vendez-vous-users') // whatever your database name is
	app.listen(3702, () => {
		console.log('vendez-vous server started')
		})
	})

app.get('/', function(req, res) {
	res.send('Hello World - vendez-vous')
	})
