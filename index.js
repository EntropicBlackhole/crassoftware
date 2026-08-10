const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.redirect("/saas");
});

app.get("/saas", (req, res) => {
  const filePath = path.join(__dirname, "saas", "index.html");
  res.sendFile(filePath);
});

app.get("/saas/:software", (req, res) => {
  const filePath = path.join(
    __dirname,
    "saas",
    req.params.software,
    "index.html",
  );

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  res.status(404).send("Software not found");
});

app.get("/saas/:software/:page", (req, res) => {
  const { software, page } = req.params;

  const filePath = path.join(__dirname, "saas", software, `${page}.html`);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
