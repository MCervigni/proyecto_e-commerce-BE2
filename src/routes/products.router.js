import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controller/products.controller.js";

export const router = Router();

// Ruta raíz: Obtener todos los productos
router.get("/", getProducts);

// Ruta para obtener un producto por su ID
router.get("/:pid", getProductById);

// Ruta para agregar un nuevo producto
router.post("/", authenticate, authorize("admin"), addProduct);

// Ruta para actualizar un producto por su ID
router.put("/:pid", authenticate, authorize("admin"), updateProduct);

// Ruta para eliminar un producto por su ID
router.delete("/:pid", authenticate, authorize("admin"), deleteProduct);
