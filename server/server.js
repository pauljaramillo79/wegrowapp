const express = require("express");
const PORT = process.env.PORT || 4001;
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "..", "client", "build")));

// Fix for the Cannot Get... issue. Bsically redirects all server calls to Index.html and then lets React Router handle what to show on browser
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "..", "client", "build", "index.html"),
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
