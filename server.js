console.log('vendez-vous')
const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.listen(5108, function() {
		  console.log('listening on 5108')
		  })

app.get('/', function(req, res) {
		  res.send('Hello World - vendez-vous')
		  })
