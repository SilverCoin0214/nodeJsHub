const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const errorHandler = require("./err-handle");
const useRoute = require("../router/index");

const app = new Koa();

app.use(bodyParser());
useRoute(app);
app.on("error", errorHandler);

module.exports = app;
