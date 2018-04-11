console.log('vendez-vous')
const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.listen(3702, function() {
		  console.log('vendez-vous server started')
		  })

app.get('/', function(req, res) {
		  res.send('Hello World - vendez-vous')
		  })
