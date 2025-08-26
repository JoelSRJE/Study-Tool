const express = require("express");
const cors = require("cors");
const app = express();
const port = 3005;

app.use(cors());

app.get("/status", (req, res) => {
  const currentTime = new Date();
  res.json({
    status: "Online",
    message: "Project is running",
    timestamp: currentTime.toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Server is running`);
});

// module.exports = app;
