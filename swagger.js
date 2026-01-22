/*
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "/routes/*.js")],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
*/
// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

// ห้าม require swaggerUi ตรงนี้ เพราะเราส่ง specs ไปใช้ใน index.js อย่างเดียว
// (ลบ const swaggerUi = ... ออกจากไฟล์นี้ถ้าไม่ได้ใช้ในนี้) 

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
    },
    servers: [
      {
        // ใช้ url เป็น / เพื่อให้อ้างอิงตาม Domain ปัจจุบันอัตโนมัติ
        url: "/", 
        description: "Current Server (Vercel/Local)",
      },
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // ใช้ path.resolve เพื่อความชัวร์ใน Serverless env
  apis: [path.resolve(__dirname, "./routes/*.js")],
};

const specs = swaggerJsdoc(options);

// แก้ไขการ export ให้เหลือแค่ specs (เพราะ swaggerUi ย้ายไป setup ที่ index.js แล้ว)
// หรือถ้า index.js คุณ require แบบเดิม ก็ต้อง export ให้ตรงกัน
// แต่แนะนำให้ export แค่ specs ก็พอ แล้ว index.js ไป require 'swagger-ui-express' เองจะสะอาดกว่า
const swaggerUi = require("swagger-ui-express"); // ถ้า index.js เรียกใช้ตัวแปรนี้จากที่นี่ ก็คงไว้
module.exports = { swaggerUi, specs };