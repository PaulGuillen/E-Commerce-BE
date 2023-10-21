const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

/*
* RUTAS
*/
const login = require('./routes/loginRoutes');
const home = require('./routes/homeRoutes');
const favourites = require('./routes/favouriteRoutes');
const perfil = require('./routes/perfilRoutes');
const promotion = require('./routes/promotionRoutes');
const order = require('./routes/orderRoutes');
const address = require('./routes/addressRoutes');
const payment = require('./routes/paymentRoutes');
const productPayed = require('./routes/productPayedRoutes');

app.set("port", port);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.disable("x-powered-by");

server.listen(port, function () {
  console.log("Aplicacion de NodeJS en el puerto " + port + " Iniciando...");
});

/*
* LLAMANDO A LA RUTAS
*/
login(app)
home(app)
favourites(app)
perfil(app)
promotion(app)
order(app)
address(app)
payment(app)
productPayed(app)

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});
