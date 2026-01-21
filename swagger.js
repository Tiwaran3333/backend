const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },

    // ⭐⭐⭐ สำคัญที่สุด ⭐⭐⭐
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // (ไม่บังคับ แต่แนะนำ)
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js"], // path ที่เก็บ @openapi
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
