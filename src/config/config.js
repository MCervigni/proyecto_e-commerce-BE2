process.loadEnvFile("./src/.env");

export const config = {
  PORT: process.env.PORT,
  PRODUCTS_PATH: process.env.PRODUCTS_PATH,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  SECRET_SESSION: process.env.SECRET_SESSION,
  SECRET_JWT: process.env.SECRET_JWT
};
