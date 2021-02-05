const express = require("express");
const PORT = process.env.PORT || 4001;
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.use("/", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server listening in port ${PORT}`);
});
