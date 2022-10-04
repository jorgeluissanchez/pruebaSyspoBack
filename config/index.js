require("dotenv").config();

const config = {
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET,
  port: process.env.PORT || 5000,
  db: process.env.DB_URL,
  fileRoute: process.env.FILE_ROUTE,
  public_route: process.env.PUBLIC_ROUTE,
  host: process.env.HOST,
};

module.exports = { config: config };
