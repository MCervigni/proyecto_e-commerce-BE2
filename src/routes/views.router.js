import { Router } from "express";
import { productsService } from "../repository/ProductsRepository.js";
import { CartManagerMongoDB as CartManager } from "../dao/CartManagerMongoDB.js";
import { processServerError } from "../utils.js";
import { isValidObjectId } from "mongoose";

export const router = Router();

router.get("/products", async (req, res) => {
  try {
    const products = await productsService.getProducts();
    res.render("home", { products });
  } catch (error) {
    processServerError(res, error);
  }
});

router.get("/cart/:cid", async (req, res) => {
  const { cid } = req.params;

  if (!isValidObjectId(cid)) {
    return res.status(400).json({ error: `El ID ingresado no es válido` });
  }

  try {
    const cart = await CartManager.getCartById(cid);
    if (!cart) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No existe carrito con ID ${cid}` });
    }

    res.render("cart", {
      title: "Cart",
      cart,
    });
  } catch (error) {
    processServerError(res, error);
  }
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Registro" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

router.get("/session", (req, res) => {
  res.render("session", { title: "Datos del Usuario" });
});
