import { Cart } from "./models/cartsModel.js";

export class CartManagerMongoDB {
  // Obtener todos los carritos
  static async getAll() {
    try {
      return await Cart.find().lean();
    } catch (error) {
      throw new Error("Error al obtener los carritos: " + error.message);
    }
  }

  // Obtener un carrito por ID
  static async getById(id) {
    try {
      return await Cart.findById(id); // .populate("products.product");
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  // Crear un carrito
  static async create(cartData) {
    try {
      const newCart = new Cart(cartData);
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  // Actualizar un carrito por ID
  static async update(id, updates) {
    try {
      return await Cart.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
    } catch (error) {
      throw new Error("Error al actualizar el carrito: " + error.message);
    }
  }

  // Eliminar un carrito por ID
  static async delete(id) {
    try {
      return await Cart.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new Error("Error al eliminar el carrito: " + error.message);
    }
  }
}