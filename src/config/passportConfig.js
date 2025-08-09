import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { UserManagerMongoDB as UserManager } from "../dao/UserManagerMongoDB.js";
import { config } from "../config/config.js";

// Extrae JWT desde cookies
const cookieExtractor = (req) => {
  return req?.cookies?.token || null;
};

export const initializePassport = () => {
  // Estrategia registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body;
          if (!first_name || !last_name || age === undefined) {
            return done(null, false, {
              message:
                "Todos los campos: NOMBRE | APELLIDO | EDAD | EMAIL | PASSWORD son obligatorios",
            });
          }
          if (isNaN(age) || Number(age) <= 0) {
            return done(null, false, {
              message: "La edad debe ser un número válido mayor a 0",
            });
          }
          if (!password || password.length < 6) {
            return done(null, false, {
              message: "La contraseña debe tener al menos 6 caracteres",
            });
          }
          const exists = await UserManager.findOne({ email });
          if (exists) {
            return done(null, false, {
              message: `Ya existe un usuario con el email ${email}`,
            });
          }
          const hashedPassword = bcrypt.hashSync(password, 10);
          const newUser = await UserManager.createUser({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: role || "user",
          });
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await UserManager.loginUser(email);
          if (!user) {
            return done(null, false, { message: "Credenciales inválidas" });
          }
          const isPasswordValid = bcrypt.compareSync(password, user.password);
          if (!isPasswordValid) {
            return done(null, false, { message: "Credenciales inválidas" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia current
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.SECRET_JWT,
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserManager.findOne({ _id: jwt_payload.id });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
