const app = require("./app");
const port = 8080;

// What port we listen on

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
