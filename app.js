const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https=require("https");

const app = express();//By assigning express() to the app variable, you can use the app object to define routes and middleware for your application. For example, you can use app.get() to define a route that handles GET requests to a specific URL, or you can use app.use() to add middleware functions that process requests before they reach your routes.



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // as we look in signup.html we can see bootstrap is from remote location(means it's being uploded somewere on net)but style.css is local so this is basicaallly a static page which we want to excess

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/",function(req,res){
const firstname=req.body.fname;
const lastname=req.body.lname;
const email=req.body.email;

const data={
  members:[ // we are sending it as a array bec mailchip will accepet it as an array call members 
    {
      email_address:email ,
      status:"subscribed" ,
      merge_fields:{ // merger fiel is na objet so it will written inside {}
      FNAME:firstname,
      LNAME:lastname,
      }

    }
  ]
}
// as the data we get is Java scrip but we want in flat pack json which can be done with stringify as we have already studieds about it
const jsonData=JSON.stringify(data);
// now this data is going to be send to mailchimp 

const url="https://us11.api.mailchimp.com/3.0/lists/25583e34e2" // https://usX.api.mailchimp.com/3.0/lists/listId where x=your api id last digit 
const option ={ //the most impt object we have to specify is method 
  method:"POST",
  auth:"Nikhil1:7495190a4bf006a3dc40e75c725c8c7d-us11"

}
// as we want to post data not to get data from api so we will we https.request not https.get 
// to send data to mailchimp first we have to save it anywhere let save it in const request 
const request = https.request(url,option,function(response){

  if(response.statusCode===200){
    res.sendFile(__dirname+"/success.html");
  }else{
    res.sendFile(__dirname+"/failure.html");
  }


  response.on('data', function(data){
  console.log(JSON.parse(data));
});
})
// now we will pass that data to mailchimp 
request.write(jsonData);
// once the data is been send just end the process 
request.end();


})
// when we are going to press try againg it is going to trigger we are going to post request to "/failure" route ans that is going to call our server here(downward code) and that it will redirected to homepage
app.post("/failure",function(req,res){
 res.redirect("/");
})
// now as we want it to run on othere server do we can decide that it should run on 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("The server is working");
});


// api key  7495190a4bf006a3dc40e75c725c8c7d-us11
// audience id 25583e34e2


// all about option in https.request 
// The option parameter in the https.request function is used to specify various options for the HTTP request being made. It is an object that allows you to customize the behavior of the request. Here are some commonly used options:
// method: Specifies the HTTP method to be used for the request, such as 'GET', 'POST', 'PUT', 'DELETE', etc.
// headers: An object containing the headers to be included in the request. Headers are key-value pairs that provide additional information about the request, such as the content type, authorization tokens, etc.
// auth: Specifies the authentication credentials to be used for the request. It can be an object with username and password properties, or a string in the format 'username:password'.
// timeout: Specifies the maximum time, in milliseconds, to wait for a response before aborting the request.
// agent: Specifies an instance of the http.Agent or https.Agent class to be used for the request. This allows you to control options related to connection pooling and reuse.
// ca: An array of strings or a string containing trusted certificates in PEM format. It is used to verify the server's SSL certificate.
// cert: Specifies the client certificate in PEM format.
// key: Specifies the private key in PEM format.
// These are just a few examples of the options that can be specified in the option object. The exact set of available options may depend on the library or framework you are using to make the HTTPS request. It's