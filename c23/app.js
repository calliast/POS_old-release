var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

async function main() {
  try {
    const Pool = require("pg").Pool;

    const pool = new Pool({
      user: "ikhsan",
      host: "localhost",
      database: "posdb",
      password: "1234",
      port: 5432,
    });

    console.log(`Successfully connected to pgAdmin4`);

    return pool;
  } catch (error) {
    throw error;
  }
}

main().then((db) => {
  var indexRouter = require("./routes/index")(db);
  var usersRouter = require("./routes/users");

  var app = express();

  // view engine setup
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "/views"));

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", indexRouter);
  app.use("/users", usersRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  var debug = require("debug")("c22:server");
  var http = require("http");

  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort(process.env.PORT || "3023");
  app.set("port", port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  }
});