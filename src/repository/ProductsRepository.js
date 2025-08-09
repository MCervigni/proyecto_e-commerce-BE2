import { ProductManagerMongoDB as ProductManager } from "../dao/ProductManagerMongoDB.js";

class ProductsRepository {
  #productsDAO;
  constructor(productsDAO) {
    this.#productsDAO = productsDAO;
  }

  // Obtener todos los productos
  async getProducts() {
    return this.#productsDAO.getAll();
  }

  // Obtener un producto por ID
  async getProductById(id) {
    return this.#productsDAO.getById(id);
  }

  // Crear un nuevo producto
  async addProduct(product) {
    return this.#productsDAO.create(product);
  }

  // Actualizar un producto por ID
  async updateProduct(id, updates) {
    return this.#productsDAO.update(id, updates);
  }

  // Eliminar un producto por ID
  async deleteProduct(id) {
    return this.#productsDAO.delete(id);
  }
}

export const productsService = new ProductsRepository(ProductManager);
