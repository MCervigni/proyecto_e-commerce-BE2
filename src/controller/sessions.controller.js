import { processServerError } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { UsersDTO } from "../dto/UsersDTO.js";

// Rregistro de usuario
export const registerUser = (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(400)
        .json({ error: info.message || "Error en el registro" });
    }
    return res.status(201).json({
      message: `Registro exitoso para ${user.first_name}`,
      newUser: user,
    });
  })(req, res, next);
};

// Inicio de sesión de usuario
export const loginUser = (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "Credenciales inválidas" });
    }

    const userObj = user?.toObject ? user.toObject() : user;

    const token = jwt.sign(
      { id: userObj._id, email: userObj.email, role: userObj.role },
      config.SECRET_JWT,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      message: `Inicio de sesión exitoso para ${userObj.first_name}`,
      user: userObj,
    });
  })(req, res, next);
};

// Obtener el usuario actual
export const getCurrentUser = [
  (req, res, next) => {
    passport.authenticate("current", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        let message = "No hay usuario logueado";
        if (info && info.message === "No auth token") {
          message = "No hay usuario logueado";
        } else if (info && info.message) {
          message = info.message;
        }
        return res.status(401).json({
          message,
          error: info?.message || "Token inválido o expirado",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    const user = req.user;
    const safeUser = new UsersDTO(user);
    res.status(200).json({ message: "Usuario logueado", user: safeUser });
  },
];

// Cerrar sesión de usuario
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    processServerError(res, error);
  }
};
