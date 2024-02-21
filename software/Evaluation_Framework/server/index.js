const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var https = require("https");
var querystring = require("querystring");
var qs = require('qs');
//let {PythonShell} = require('python-shell')

const fetch = require('node-fetch');

var fs = require('fs');
var parse = require('csv-parser');

var part_id = -2;
var host = "";
var assignmentId = "";
var hitId = "";
var turkSubmitTo = "";
var workerId = "";

const app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    if (req.method === "OPTIONS") res.send(200);
    else next();
}
app.use(allowCrossDomain);

// global controller
app.get('/emotionrecog/*',function(req,res,next){
//app.get('/*',function(req,res,next){
    res.header('Content-Security-Policy', "frame-ancestors https://worker.mturk.com/ https://workersandbox.mturk.com/")
    //res.header('Content-Security-Policy', "frame-ancestors https://worker.mturk.com/")
    next(); // http://expressjs.com/guide.html#passing-route control
});

app.set('views', path.join(__dirname, '../build'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use('/emotionrecog', express.static('build'));
//app.use(express.static('build'));

app.get('/emotionrecog/app', (req, res) => {
//app.get('/app', (req, res) => {
  const part = -2;
  host = undefined;
  assignmentId = undefined;
  workerId = undefined;
  hitId = undefined;
  res.render('index', { part, host, assignmentId, workerId, hitId });
});

//app.get('/emotionrecog/part/:part', (req, res) => {
/*app.get('/part/:part', (req, res) => {
  const {part} = req.params;

  part_id = req.params.part;

  host = req.query.host;
  assignmentId = req.query.assignmentId;
  hitId = req.query.hitId;
  turkSubmitTo = req.query.turkSubmitTo;
  workerId = req.query.workerId;

  console.log(part_id);
  console.log(req.query.host);
  console.log(req.query.assignmentId);
  console.log(req.query.hitId);
  console.log(req.query.turkSubmitTo);
  console.log(req.query.workerId);

  res.render('index', { part, host, assignmentId, workerId, hitId });
});*/


app.get('/emotionrecog/api/greeting', (req, res) => {
//app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.post("/emotionrecog/save", function (req, res) {
//app.post("/save", function (req, res) {
	console.log(req.body);// req data
	var answer_obj = req.body;

	if (typeof host !== 'undefined') {
		answer_obj["assignmentId"] = assignmentId;
		answer_obj["hitId"] = hitId;
		answer_obj["turkSubmitTo"] = turkSubmitTo;
		answer_obj["workerId"] = workerId;
	}

	query_obj = {}
	query_obj["assignmentId"] = assignmentId;
	

	saveToFolder(answer_obj, query_obj, function(err) {
    	if (err) {
    		console.log(err)
	      res.status(400).json({"saved":false});
	      return;
	    }
	    console.log("saved succeess")
	    res.status(201).json({"saved":true});
	 });
});

app.post("/emotionrecog/proceed", function (req, res) {
//app.post("/proceed", function (req, res) {
	console.log(req.body);// req data
	var answer_obj = req.body;
	saveToFolderProceed(answer_obj, function(err) {
    	if (err) {
    		console.log(err)
	      res.status(400).json({"saved":false});
	      return;
	    }
	    console.log("saved succeess")
	    res.status(201).json({"saved":true});
	 });
});

app.get("/emotionrecog/files", function (req, res) {
//app.get("/files", function (req, res) {
	//console.log("Inside files...")

	// local:
	inprogress = fs.readdirSync("./public/accepted");
	completed = fs.readdirSync("./public/data");

	// lia server:
	//inprogress = fs.readdirSync(path.resolve(__dirname, "../public/accepted/"));
	//completed = fs.readdirSync(path.resolve(__dirname, "../public/data/"));

	res.end(JSON.stringify({ inprogress: inprogress, completed: completed}));
});

app.get("/emotionrecog/users", function (req, res) {
//app.get("/users", function (req, res) {
	var csvData=[];
	var file_path = path.resolve(__dirname, "../public/users/users.csv");
	fs.createReadStream(file_path)
	    .pipe(parse({delimiter: ':'}))
	    .on('data', function(csvrow) {
	        csvData.push(csvrow);        
	    })
	    .on('end',function() {
	      res.end(JSON.stringify({ users: csvData}));
	    });
});


function saveToFolderProceed(answer_obj, callback) {
	// lia server:
	var file_path = path.resolve(__dirname, "../public/accepted/" + answer_obj.part + "-" + answer_obj.annotator_name + "-" + formatDate(new Date()) + ".json");
	// local:
	//var file_path = "./public/accepted/" + answer_obj.part + "-" + answer_obj.annotator_name + "-" + formatDate(new Date()) + ".json";
	fs.writeFile(file_path, JSON.stringify(answer_obj), callback);
}


function saveToFolder(answer_obj, query_obj, callback) {

	if (typeof host !== 'undefined') {
		// lia server:
		var file_path = path.resolve(__dirname, "../public/data/" + answer_obj.part + "-" + answer_obj.assignmentId + "-" + answer_obj.hitId + "-" + answer_obj.workerId + "-" + formatDate(new Date()) + ".json");
		// local:
		//var file_path = "./public/data/" + answer_obj.part + "-" + answer_obj.assignmentId + "-" + answer_obj.hitId + "-" + answer_obj.workerId + "-" + formatDate(new Date()) + ".json";
		fs.writeFile(file_path, JSON.stringify(answer_obj), callback);
	} else {
		// lia server:
		var file_path = path.resolve(__dirname, "../public/data/" + answer_obj.part + "-" + answer_obj.annotator_name + "-" + formatDate(new Date()) + ".json");
		// local:
		//var file_path = "./public/data/" + answer_obj.part + "-" + answer_obj.annotator_name + "-" + formatDate(new Date()) + ".json";
		fs.writeFile(file_path, JSON.stringify(answer_obj), callback);
	}

}

function dateComponentPad(value) {
  var format = String(value);
  return format.length < 2 ? '0' + format : format;
}

function formatDate(date) {
  var datePart = [ date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate() ].map(dateComponentPad);
  var timePart = [ date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() ].map(dateComponentPad);

  return datePart.join('-') + ' ' + timePart.join(':');
}


const hostname = '127.0.0.1';
//const port = 3000;
const port = 5434;
app.listen(port, hostname, () =>
  console.log(`Express server is running on ${hostname}:${port}`)
);