import express from "express";
import { engine } from "express-handlebars";
import { router as viewsRouter } from "./routes/views.router.js";
import { router as productsRouter } from "./routes/products.router.js";
import { router as cartsRouter } from "./routes/carts.router.js";
import { router as sessionsRouter } from "./routes/sessions.router.js";
import { connectDB } from "./config/connDB.js";
import { config } from "./config/config.js";
import { initializePassport } from "./config/passportConfig.js";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express();

app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(cookieParser());
app.use(express.static("src/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  if (err && err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

app.listen(config.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${config.PORT}`);
});

connectDB(config.MONGO_URL, config.DB_NAME);
