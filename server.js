var http=require('http');
var fs = require("fs");
var url = require("url");
var replace = require("./replace");

var output = fs.readFileSync("data.json");
output = output + "";
output = JSON.parse(output);

var productPage = fs.readFileSync("product.html");
//console.log(typeof productPage);
//console.log(typeof (productPage + ""));
productPage = productPage + "";


var overviewPage = fs.readFileSync("overview.html");
overviewPage = overviewPage + "";

var backgroundPage = fs.readFileSync("background.html");
backgroundPage = backgroundPage + "";

var templatePage = fs.readFileSync("template.html");
templatePage = templatePage + "";

//productPage = productPage.replace(/Fresh Avocado/g, "Organic Avocados");
//productPage = productPage.replace(/ProductName/g, output[2].productName);
//productPage = productPage.replace(/ProductDescription/g, output[1].description);

var server = http.createServer(function(req, res){

  var tempFile = productPage;

  if(req.url == "/" || req.url == "/overview"){
	  var cards = "";

	for(var i=0; i<output.length; i++){
       cards += replace(templatePage, output[i]);
	}

	backgroundPage = backgroundPage.replace(/%CARDS%/g, cards);
	//res.write(overviewPage);
	res.write(backgroundPage);
  }else if(req.url == "/api"){
    res.write(output);
  }else if(req.url == "/product"){
    res.write(productPage);
  }else{
	  //console.log(req.url);
	  var parsedUrl = url.parse(req.url, true).query.id;
	  tempFile = tempFile.replace(/ProductName/g, output[parsedUrl].productName);
	  tempFile = tempFile.replace(/ProductDescription/g, output[parsedUrl].description);
	  res.write(tempFile);

	  console.log(parsedUrl);
    //res.write("Error 404 page not found");
  }	

  //res.write("Response from Node server");
  res.end();
});	

var port = process.env.PORT || 3000;

server.listen(port, function(){
	console.log("Server is listening at port 3000");
});