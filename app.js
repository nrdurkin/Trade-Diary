let express = require("express");
let app = express();
let port = process.env.port || 8000;

const history = require("connect-history-api-fallback");
app.use(history());

app.use(express.static(__dirname + "/dist"));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
