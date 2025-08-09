import { cartsService } from "../repository/CartsRepository.js";
import { productsService } from "../repository/ProductsRepository.js";
import { isValidObjectId } from "mongoose";
import { processServerError } from "../utils.js";
import { Ticket } from "../dao/models/ticketsModel.js";

// Obtener todos los carritos
export const getCarts = async (req, res) => {
  try {
    const carts = await cartsService.getCarts();
    return res.status(200).json({ carts });
  } catch (error) {
    processServerError(res, error);
  }
};

// Obtener un carrito por ID
export const getCartById = async (req, res) => {
  let { cid } = req.params;
  if (!isValidObjectId(cid)) {
    return res
      .status(400)
      .json({ error: `El ID del carrito ingresado no es válido` });
  }
  try {
    const cart = await cartsService.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `No se encontró carrito con Id ${cid}` });
    }
    return res.status(200).json({ cart });
  } catch (error) {
    processServerError(res, error);
  }
};

// Crear un nuevo carrito
export const createCart = async (req, res) => {
   const user = req.user.email;
  try {
    const newCart = await cartsService.createCart({ user });
    res.status(201).json({ message: "Carrito creado exitosamente", newCart });
  } catch (error) {
    processServerError(res, error);
  }
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  if (!isValidObjectId(cid)) {
    return res
      .status(400)
      .json({ error: `El ID del carrito ingresado no es válido` });
  }
  if (!isValidObjectId(pid)) {
    return res
      .status(400)
      .json({ error: `El ID del producto ingresado no es válido` });
  }

  try {
    const productExists = await productsService.getProductById(pid);
    if (!productExists) {
      return res
        .status(404)
        .json({ error: `El producto con ID ${pid} no existe` });
    }

    const cart = await cartsService.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `No se encontró un carrito con ID ${cid}` });
    }

    const updatedCart = await cartsService.addProductToCart(cid, pid);
    return res.status(200).json({
      message: "Producto agregado al carrito exitosamente",
      updatedCart,
    });
  } catch (error) {
    processServerError(res, error);
  }
};

// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  if (!isValidObjectId(cid)) {
    return res
      .status(400)
      .json({ error: `El ID del carrito ingresado no es válido` });
  }
  if (!isValidObjectId(pid)) {
    return res
      .status(400)
      .json({ error: `El ID del producto ingresado no es válido` });
  }

  try {
    const cart = await cartsService.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `No se encontró carrito con ID ${cid}` });
    }

    const exists = cart.products.some(
      (p) => p.product.toString() === pid
    );
    if (!exists) {
      return res
        .status(404)
        .json({ error: `El producto con ID ${pid} no está en el carrito` });
    }
    
    const updatedCart = await cartsService.removeProductFromCart(cid, pid);

    return res.status(200).json({
      message: "Producto eliminado del carrito exitosamente",
      updatedCart,
    });
  } catch (error) {
    processServerError(res, error);
  }
};

// Actualizar el carrito con un arreglo de productos
export const updateCart = async (req, res) => {
  const { cid } = req.params;
  const products = req.body;

  if (!isValidObjectId(cid)) {
    return res
      .status(400)
      .json({ error: `El ID del carrito ingresado no es válido` });
  }

  if (!Array.isArray(products)) {
    return res.status(400).json({
      error: `El cuerpo de la solicitud debe ser un arreglo de productos`,
    });
  }

  try {
    const combinedProducts = products.reduce((acc, product) => {
      if (!isValidObjectId(product.product)) {
        throw new Error(`El ID del producto ${product.product} no es válido`);
      }
      if (typeof product.quantity !== "number" || product.quantity <= 0) {
        throw new Error(
          `La cantidad del producto ${product.product} debe ser un número positivo`
        );
      }

      const existingProduct = acc.find(
        (p) => p.product.toString() === product.product
      );
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        acc.push(product);
      }
      return acc;
    }, []);

    for (const product of combinedProducts) {
      const productExists = await productsService.getProductById(
        product.product
      );
      if (!productExists) {
        return res
          .status(404)
          .json({ error: `El producto con ID ${product.product} no existe` });
      }
    }

    const cart = await cartsService.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `No se encontró un carrito con ID ${cid}` });
    }

    const updatedCart = await cartsService.updateCart(cid, combinedProducts);
    return res
      .status(200)
      .json({ message: "Carrito actualizado exitosamente", updatedCart });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!isValidObjectId(cid)) {
    return res
      .status(400)
      .json({ error: `El ID del carrito ingresado no es válido` });
  }
  if (!isValidObjectId(pid)) {
    return res
      .status(400)
      .json({ error: `El ID del producto ingresado no es válido` });
  }

  if (typeof quantity !== "number" || quantity <= 0) {
    return res
      .status(400)
      .json({ error: `La cantidad debe ser un número positivo` });
  }

  try {
    const cart = await cartsService.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `No se encontró un carrito con ID ${cid}` });
    }

    const product = await productsService.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ error: `No existe producto con ID ${pid}` });
    }

    const updatedCart = await cartsService.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    return res.status(200).json({
      message: "Cantidad del producto actualizada exitosamente",
      updatedCart,
    });
  } catch (error) {
    processServerError(res, error);
  }
};

// Eliminar todos los productos del carrito
export const clearCart = async (req, res) => {
  const { cid } = req.params;

  if (!isValidObjectId(cid)) {
    return res
      .status(400)
      .json({ error: `El ID del carrito ingresado no es válido` });
  }

  try {
    const cart = await cartsService.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `No se encontró un carrito con ID ${cid}` });
    }
    const updatedCart = await cartsService.clearCart(cid);
    return res.status(200).json({
      message: "Todos los productos del carrito fueron eliminados exitosamente",
      updatedCart,
    });
  } catch (error) {
    processServerError(res, error);
  }
};

// Comprar un carrito
export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const userEmail = req.user.email;
  
  if (!isValidObjectId(cid)) {
    return res
      .status(400)
      .json({ error: `El ID del carrito ingresado no es válido` });
  }

  try {
    const cart = await cartsService.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `No se encontró un carrito con ID ${cid}` });
    }

if (!cart.products || cart.products.length === 0) {
      return res
        .status(400)
        .json({ error: "El carrito está vacío, no se puede realizar la compra" });
    }

    let total = 0;
    for (const item of cart.products) {
      const product = await productsService.getProductById(item.product.toString());
      if (!product) {
        return res.status(404).json({ error: `Producto ${item.product} no existe` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `No hay stock suficiente para el producto ${product.title || item.product}` });
      }
      total += product.price * item.quantity;
    }
    for (const item of cart.products) {
      await productsService.updateProduct(item.product.toString(), {
        $inc: { stock: -item.quantity }
      });
    }
    await cartsService.clearCart(cid);

    // Crear un ticket de compra
    const ticket = await Ticket.create({
      ticketId: Date.now().toString(),
      amount: total,
      purchaser: userEmail,
      date: new Date()
    });
    
    return res.status(200).json({
      message: "Compra realizada exitosamente",
      ticket: {
        ticketId: ticket._id,
        date: ticket.date,
        amount: ticket.amount,
        purchaser: ticket.purchaser
      }
    });
  } catch (error) {
    processServerError(res, error);
  }
};
