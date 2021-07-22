const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');
const app = express();


var items = "";

app.use(bodyParser.urlencoded({
  extented: true
}));

app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/VIVEKDBFINAL", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const questionSchema = {
  title: String,
  content: String,
  link: String,
  tag: String
};

const Question = mongoose.model("Question", questionSchema);


let queslink = [];
let tags = [];
let content = [];
let quesid = [];


app.get("/", function(req, res) {

  const day = "vivek";

  res.render("home", {
    listTitle: day,
    tag: tags,
    questio: quesid,
    contens: content,
    link: queslink
  });

});

app.post("/", function(req, res) {
  items = req.body.newinputforsearch;
  // console.log(items);
  var search = items;
  search = _.toLower(search);
  Question.find(function(err, founds) {
    if (!err) {


      queslink = [];
      tags = [];
      content = [];
      quesid = [];

      founds.forEach(function(found) {
        var a = _.toLower(found.title);
        if (a.includes(search)) {
          queslink.push(found.link);
          tags.push(found.tag);
          content.push(found.content);
          quesid.push(found.title);
        }

        var b = _.toLower(found.id);
        if (b.includes(search)) {
          queslink.push(found.link);
          tags.push(found.tag);
          content.push(found.content);
          quesid.push(found.title);
        }

        var c = _.toLower(found.content);
        if (c.includes(search)) {
          queslink.push(found.link);
          tags.push(found.tag);
          content.push(found.content);
          quesid.push(found.title);
        }

        var d = _.toLower(found.tag);
        if (d.includes(search)) {
          queslink.push(found.link);
          tags.push(found.tag);
          content.push(found.content);
          quesid.push(found.title);
        }

      });

if(tags.length===0)
{
var op="Oops no questions found!";
content.push(op);
tags.push("");
quesid.push("");
queslink.push("");
  res.render("home2", {
    listTitle: "Lastt.",
    // newitemffff: items,
    tag: tags,
    questio: quesid,
    contens: content,
    link: queslink
  });

}
else
{
  res.render("home2", {
    listTitle: "Lastt.",
    // newitemffff: items,
    tag: tags,
    questio: quesid,
    contens: content,
    link: queslink
  });
}


  }


});

});


app.listen(3000, function() {
  console.log("Server is running...");
});
