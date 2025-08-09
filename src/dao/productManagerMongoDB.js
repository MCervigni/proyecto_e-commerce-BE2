import { Product } from "./models/productsModel.js";

export class ProductManagerMongoDB {
  // Obtener todos los productos
  static async getAll() {
    try {
      return await Product.find().lean();
    } catch (error) {
      throw new Error("Error al leer los productos: " + error.message);
    }
  }

  // Obtener un producto por ID
  static async getById(id) {
    try {
      return await Product.findById(id).lean();
    } catch (error) {
      throw new Error("Error al buscar el producto: " + error.message);
    }
  }

  // Crear un producto
  static async create(product) {
    try {
      const newProduct = await Product.create(product);
      return newProduct.toJSON();
    } catch (error) {
      throw new Error("Error al agregar el producto: " + error.message);
    }
  }

  // Actualizar un producto
  static async update(id, updates) {
    try {
      return await Product.findByIdAndUpdate(id, updates, { new: true }).lean();
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  // Eliminar un producto
  static async delete(id) {
    try {
      return await Product.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }
}
