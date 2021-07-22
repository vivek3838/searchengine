// parsing and datasaving into database via scrapping

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const rp = require('request-promise');
const axios = require('axios');
const {
  parse
} = require('node-html-parser')

let alltag = "";
var cnttag = 0;

// mongoose.connect("mongodb+srv://abhishek:family@cluster0.ogfbv.mongodb.net/cpquestionsDB?retryWrites=true&w=majority",
//
//
// "mongodb://localhost:27017/VIVEKDBFINAL"

mongoose.connect("mongodb+srv://vivek_3838:vivek1212@cluster0.dwa1g.mongodb.net/vivekquestionsDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const allquestionSchema = {
  title: String,
  content: String,
  link: String,
  tag: String
};

const Question = mongoose.model("Question", allquestionSchema);


for (var i = 1; i <= 10; i++) {
  const url = 'https://codeforces.com/problemset/page/' + i;
  rp(url)
    .then(function(html) {
      const findlink = parse(html);
      const title1 = findlink.querySelectorAll("a");

      var cnt = 0;

      for (var i = 0; i < title1.length; i++) {
        var part1 = title1[i].text.trim();
        // console.log(part1);
        var part2 = title1[i].getAttribute("href");
        // console.log(part2);

        part2 = part2.trim();
        var req = part2.substr(1, 19);
        if (req === 'problemset/problem/') {
          let str = part2;
          // console.log(stri);
          str = str.substr(20);

          let newStr = str.replace('/', '');
          newStr = newStr.replace('/', '');

          if (newStr != part1) {

            const ques1 = new Question({
              title: newStr,
              content: part1,
              link: "https://codeforces.com" + part2,
            });

            ques1.save();

            // } // yeh niiche lejana hai...

            const innerurl = "https://codeforces.com" + title1[i].getAttribute("href");

            rp(innerurl).then(function(html) {
                const findlink = parse(html);
                const title1 = findlink.querySelectorAll(".tag-box");
                alltag = "";
                for (var i = 0; i < title1.length; i++) {
                  alltag += title1[i].innerText.trim();
                  alltag += '/';
                }

                Question.updateOne({
                  title: newStr
                }, {
                  tag: alltag
                }, function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    // console.log("successed");
                    // cnttag++;
                    // console.log(cnttag);
                  }
                });
              })
              .catch(function(err) {
                // if(err){
                //   console.log(err);
                // }
              });

            cnt++;

          }
        }
      }
      console.log(title1.length);
      console.log(cnt);
    })
    .catch(function(err) {
      // if(err){
      //   console.log(err);
      // }
    });
}


app.listen(3000, function() {
  console.log("started..");
});
