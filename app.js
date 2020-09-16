//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));





app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  //res.send(firstName + " " + lastName + ": " + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us2.api.mailchimp.com/3.0/lists/0683e35d8b";

  const options = {
    method: "POST",
    auth: "emily61268:5efafd6536c09d8a3919bc5a99674334-us2"
  };

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});



//"process.env.PORT || 3000" make the app work both locally and on Heroku
app.listen(process.env.PORT || 3000, function(){
  console.log("Running on port 3000.");
});




/* Steps to deploy files on Heroku:
   1. Command line: heroku login
   2. Add Procfile (with web: node app.js) in project folder
   3. Command line: git init (Create a new git repository)
   4. Command line: git add .
   5. Command line: git commit -m "First commit" (or sth else)
   6. Command line: heroku create
   7. Command line: git push heroku master

   To update files that is already deployed on Heroku:
   1. Command line: git add .
   2. Command line: git commit -m "Some description about the update"
   3. Command line: git push heroku master
*/
