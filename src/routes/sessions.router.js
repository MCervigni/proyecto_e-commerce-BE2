import { Router } from "express";
import { processServerError } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const router = Router();

// Ruta para crear un nuevo usuario con Passport
router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ error: info.message || "Error en el registro" });
    }
    return res.status(201).json({
      message: `Registro exitoso para ${user.first_name}`,
      newUser: user,
    });
  })(req, res, next);
});

// Ruta para iniciar sesión con Passport
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info.message || "Credenciales inválidas" });
    }

    const userObj = user?.toObject ? user.toObject() : user;
    delete userObj.password;
    delete userObj.createdAt;
    delete userObj.updatedAt;
    delete userObj.__v;

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
});

// Ruta para verificar usuario actual con JWT
router.get(
  "/current",
  (req, res, next) => {
    passport.authenticate("current", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          message: "No autorizado",
          error: info?.message || "Token inválido o expirado",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    const user = req.user;
    delete user.password;
    delete user.__v;
    delete user.createdAt;
    delete user.updatedAt;
    res.status(200).json({ user });
  }
);

// Ruta para cerrar sesión
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    processServerError(res, error);
  }
});
