const express = require("express");
const bodyParser = require('body-parser');
const request = require("request")
let app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('home.ejs');
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post("/word", (req, res) => {
    let val = req.body;
    if (val.word !== "" && typeof val.word === "string") {
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${val.word}`;
        request(url, (err, state, body) => {

            if (err) {
                if (err.code === 'ENOTFOUND') {
                    res.send({
                        error: "Check your network connection",
                        code: err.code
                    });
                }
            } else {
                let report = JSON.parse(body);
                if (report.title === 'No Definitions Found') {
                    res.send({
                        error: "Not found",
                        text: report.message,
                    });

                } else {
                    res.send(report)
                }
            }
        })
    }
})


const port = process.env.PORT || 500;

app.listen(port, function () {
    console.log(`listening on port ${port}!`);
})