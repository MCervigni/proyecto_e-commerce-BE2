import { User } from "./models/userModel.js";

export class UserManagerMongoDB {

  // Método para crear un nuevo usuario
  static async createUser(userData) {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  }

    // Método para obtener un usuario
  static async findOne(query) {
    return User.findOne(query).lean();
  }

    // Método para login de un usuario
  static async loginUser(email) {
    return User.findOne({ email });
  }
}
