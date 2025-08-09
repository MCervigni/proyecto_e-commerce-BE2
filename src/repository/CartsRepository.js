import { CartManagerMongoDB as CartManager } from "../dao/CartManagerMongoDB.js";
import { productsService } from "./ProductsRepository.js";

class CartsRepository {
  #cartsDAO;
  constructor(cartsDAO) {
    this.#cartsDAO = cartsDAO;
  }

  // Obtener todos los carritos
  async getCarts() {
    return this.#cartsDAO.getAll();
  }

  // Obtener un carrito por ID
  async getCartById(id) {
    return this.#cartsDAO.getById(id);
  }

  // Crear un nuevo carrito
  async createCart(cartData) {
    return this.#cartsDAO.create(cartData);
  }

  // Agregar un producto al carrito
  async addProductToCart(cartId, productId) {
    const cart = await this.#cartsDAO.getById(cartId);
    if (!cart) throw new Error("No se encontró el carrito");

    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    return cart;
  }

  // Eliminar un producto del carrito
  async removeProductFromCart(cartId, productId) {
    const cart = await this.#cartsDAO.getById(cartId);
    if (!cart) throw new Error("No se encontró el carrito");

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );
    return this.#cartsDAO.update(cartId, { products: cart.products });
  }

  // Actualizar el carrito con una lista de productos
  async updateCart(cartId, products) {
    return this.#cartsDAO.update(cartId, { products });
  }

  // Actualizar la cantidad de un producto en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.#cartsDAO.getById(cartId);
    if (!cart) throw new Error("No se encontró el carrito");

    const productInCart = cart.products.find(
      (p) =>
        (p.product &&
          p.product._id &&
          p.product._id.toString() === productId.toString()) ||
        (p.product &&
          p.product.toString &&
          p.product.toString() === productId.toString())
    );
    if (productInCart) {
      productInCart.quantity = quantity;
      await cart.save();
      return cart.toObject();
    } else {
      throw new Error("No se encontró el producto en el carrito");
    }
  }
  // Vaciar el carrito
  async clearCart(cartId) {
    return this.#cartsDAO.update(cartId, { products: [] });
  }

  // Simular la compra del carrito
  async purchaseCart(cartId) {
    const cart = await this.#cartsDAO.getById(cartId);
    if (!cart) throw new Error("No se encontró el carrito");
    if (cart.products.length === 0)
      throw new Error("El carrito está vacío, no se puede realizar la compra");

    // Validar stock suficiente y calcular total
     let total = 0;
    for (const item of cart.products) {
      const product = await productsService.getProductById(item.product.toString());
      if (!product) throw new Error(`Producto ${item.product} no existe`);
      if (product.stock < item.quantity) {
        throw new Error(
          `No hay stock suficiente para el producto ${product.title || item.product}`
        );
      }
      total += product.price * item.quantity;
    }
    // Vaciar el carrito después de la compra
    await this.#cartsDAO.update(cartId, { products: [] });
    return { message: "Compra realizada exitosamente", cartId };
  }
}

export const cartsService = new CartsRepository(CartManager);
