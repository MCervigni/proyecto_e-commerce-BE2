import { productsService } from "../repository/ProductsRepository.js";
import { isValidObjectId } from "mongoose";
import { processServerError } from "../utils.js";

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await productsService.getProducts();
    res.status(200).json({
      status: "success",
      payload: products,
    });
  } catch (error) {
    processServerError(res, error);
  }
};

// Obtener un producto por su ID
export const getProductById = async (req, res) => {
  let { pid } = req.params;
  if (!isValidObjectId(pid)) {
    return res.status(400).json({ error: `El ID ingresado no es válido` });
  }
  try {
    const product = await productsService.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ error: `No existe en DB un producto con ID ${pid}` });
    }
    return res.status(200).json({ product });
  } catch (error) {
    processServerError(res, error);
  }
};

// Agregar un nuevo producto
export const addProduct = async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;

  if (
    !title ||
    !description ||
    !code ||
    price === undefined ||
    stock === undefined ||
    !category
  ) {
    return res.status(400).json({
      error:
        "title | description | code | price | stock -> son campos obligatorios",
    });
  }

  try {
    // Si quieres mantener la validación de código único, puedes hacerlo aquí:
    const existingProducts = await productsService.getProducts();
    if (existingProducts.some((p) => p.code === code)) {
      return res.status(400).json({
        error: `El producto con el código ${code} ya existe.`,
      });
    }

    const newProduct = {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    };

    const addedProduct = await productsService.addProduct(newProduct);
    res
      .status(201)
      .json({ message: "Producto agregado exitosamente", addedProduct });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: `El producto con el código ${code} ya existe.` });
    }
    processServerError(res, error);
  }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
  let { pid } = req.params;

  if (!isValidObjectId(pid)) {
    return res.status(400).json({ error: `El ID ingresado no es válido` });
  }

  const updatedFields = req.body;

  if (!updatedFields || Object.keys(updatedFields).length === 0) {
    return res
      .status(400)
      .json({ error: "No se proporcionaron campos para actualizar" });
  }

  if (updatedFields._id) {
    return res
      .status(403)
      .json({ error: "No está permitido modificar el ID del producto" });
  }

  try {
    const product = await productsService.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ error: `No existe un producto con el ID ${pid}` });
    }

    if (updatedFields.code) {
      const existingProducts = await productsService.getProducts();
      if (
        existingProducts.some(
          (p) => p.code === updatedFields.code && p._id.toString() !== pid
        )
      ) {
        return res.status(400).json({
          error: `El código ${updatedFields.code} ya está en uso por otro producto.`,
        });
      }
    }

    const updatedProduct = await productsService.updateProduct(
      pid,
      updatedFields
    );

    res
      .status(200)
      .json({ message: "Producto actualizado exitosamente", updatedProduct });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: `El código ya existe.` });
    }
    processServerError(res, error);
  }
};

// Eliminar un producto por su ID
export const deleteProduct = async (req, res) => {
  let { pid } = req.params;
  if (!isValidObjectId(pid)) {
    return res.status(400).json({ error: `El ID ingresado no es válido` });
  }
  try {
    const product = await productsService.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ error: `No existe en DB un producto con ID ${pid}` });
    }
    const deletedProduct = await productsService.deleteProduct(pid);
    res
      .status(200)
      .json({ message: "Producto eliminado exitosamente", deletedProduct });
  } catch (error) {
    processServerError(res, error);
  }
};
