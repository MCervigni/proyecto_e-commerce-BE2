import passport from "passport";
import { cartsService } from "../repository/CartsRepository.js";

// Middleware para autenticar usando la estrategia "current"
export const authenticate = passport.authenticate("current", { session: false });

// Middleware para autorizar por rol
export const authorize = (roles = []) => {
  if (typeof roles === "string") roles = [roles];
  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ error: "NO AUTORIZADO - No tiene privilegios para acceder a este recurso" });
    }
    next();
  };
};

// Middleware para verificar si el usuario es el propietario del carrito
export const isCartOwner = async (req, res, next) => {
  const cart = await cartsService.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  if (!cart.user) return res.status(403).json({ error: "Carrito sin usuario asignado" });
  if (cart.user !== req.user.email) {
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
};