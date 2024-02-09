const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");

let express = require("express");
let DataStor = require("nedb");

// initialise app
let app = express();

// tell your express app to accept json info & parse it
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// initialise db
let db = new DataStor({
    filename: "stories.db",
    timestampData: true,
});

let db2 = new DataStor({
    filename: "archive.db",
    timestampData: true,
});

db.loadDatabase(); // only updates new values does not overwrite

// app variables
// let stories = [];

app.use("/", express.static("public"));

app.post("/message", (req, res) => {
    // here we add new stuff to the db
    db.insert(req.body, (err, newDoc) => {
        console.log("newDoc.json", newDoc);
    });
    res.json({ message: "ok" });
});

app.get("/message", (req, res) => {
    let dataToSend = {};
    // this is what we see at the front end when we fetch
    db.find({})
        .sort({ createdAt: -1 })
        .exec(function (err, docs) {
            // console.log(docs);
            dataToSend = { data: docs };
            console.log("dataToSend", dataToSend);
            res.json({ dataToSend });
        });
});

app.delete("/message/:id", (req, res) => {
    db.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
        if (err) {
            res.json({ message: "Error occurred while deleting." });
        } else {
            res.json({ message: "Successfully deleted." });
        }
    });
});

// add a new db archive.db here and add POST and GET requests for it
app.post("/archive", (req, res) => {
    // Check if req.body contains the expected data
    console.log(req.body);
    // Send a valid JSON response back
    res.json({ message: "ok" }); // Ensure this response is properly formatted
});
app.get("/archive", (req, res) => {
    let dataToSend = {};
    // this is what we see at the front end when we fetch
    db2.find({})
        .sort({ createdAt: -1 })
        .exec(function (err, docs) {
            // console.log(docs);
            dataToSend = { data: docs };
            console.log("dataToSend db2", dataToSend);
            res.json({ dataToSend });
        });
});
//

//run the createServer
let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server listening at port: " + port);
});
