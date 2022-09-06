const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res) {
  res.sendFile(__dirname+"/signUp.html")
})

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

// Content to be send to mailchimp
  var data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};

// Arranging in flat json format
const jsonData = JSON.stringify(data);

// Posting the content taken to mailchimp, using https.request
// usX where X is seen in apikey, it rage from 1 - 20
const url = "https://us12.api.mailchimp.com/3.0/lists/043f6490f3"
const options = {
  method : "POST",
  // any string as username: then password fot basic auth
  auth : "siddhesh021:2f960bae0cea7040097cdd5ce57d8225-us12"
}
const request = https.request(url, options, function(response) {

  if (response.statusCode === 200) {
    res.sendFile(__dirname+"/success.html");
  }
  else {
    res.sendFile(__dirname+"/failure.html");
  }

  response.on("data", function(data) {
    console.log(JSON.parse(data));
  })
})

request.write(jsonData);
request.end();

app.post("/failure", function(req, res) {
  res.redirect("/");
})

})

app.use(express.static('public'));

app.listen(process.env.PORT || 3000, function() {
  console.log("Connected");
});

// api Key
// 1ced5d73ca85021db95b6439dcdff235-us12

// id
//  043f6490f3
