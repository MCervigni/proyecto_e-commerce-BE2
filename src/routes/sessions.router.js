import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/sessions.controller.js";

export const router = Router();

// Ruta para crear un nuevo usuario con Passport
router.post("/register", registerUser);

// Ruta para iniciar sesión con Passport
router.post("/login", loginUser);

// Ruta para verificar usuario actual con JWT
router.get("/current", getCurrentUser);

// Ruta para cerrar sesión
router.get("/logout", logoutUser);
