import { Router } from "express";
import { authenticate, authorize, isCartOwner} from "../middleware/auth.js";
import {
  removeProductFromCart,
  addProductToCart,
  createCart,
  getCartById,
  getCarts,
  updateCart,
  updateProductQuantity,
  clearCart,
  purchaseCart
} from "../controller/carts.controller.js";

export const router = Router();

// Ruta raíz para crear un nuevo carrito
router.post("/", authenticate, authorize("user"), createCart);

// Ruta para obtener todos los carritos
router.get("/", authenticate, authorize("user"),getCarts);

// Ruta para obtener un carrito por ID
router.get("/:cid", authenticate, authorize("user"),getCartById);

// Ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", authenticate, authorize("user"), isCartOwner, addProductToCart);

// Ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid", authenticate, authorize("user"), isCartOwner, removeProductFromCart);

// Ruta para actualizar el carrito con un arreglo de productos
router.put("/:cid", authenticate, authorize("user"), isCartOwner, updateCart);

// Ruta para actualizar la cantidad de un producto en el carrito
router.put("/:cid/product/:pid", authenticate, authorize("user"), isCartOwner, updateProductQuantity);

// Ruta para eliminar todos los productos del carrito
router.delete("/:cid", authenticate, authorize("user"), isCartOwner, clearCart);

//Ruta para comprar un carrito
router.post("/:cid/purchase", authenticate, authorize("user"), isCartOwner,purchaseCart);

