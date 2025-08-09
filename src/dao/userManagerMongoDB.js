import { User } from "./models/userModel.js";

export class UserManagerMongoDB {
  // Método para crear un nuevo usuario
  static async createUser(userData) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }

  // Método para obtener un usuario
  static async findOne(query) {
    try {
      return await User.findOne(query).lean();
    } catch (error) {
      throw new Error("Error al buscar el usuario: " + error.message);
    }
  }

  // Método para login de un usuario
  static async loginUser(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error("Error al hacer login del usuario: " + error.message);
    }
  }
}
