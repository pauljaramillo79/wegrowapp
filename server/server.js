const express = require("express");
const PORT = process.env.PORT || 4001;
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "..", "client", "build", "static", "index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server listening in port ${PORT}`);
});
