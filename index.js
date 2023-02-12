const express = require('express');
const cors = require("cors");

const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});
