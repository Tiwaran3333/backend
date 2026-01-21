/*
// index.js
require('dotenv').config();
const express = require('express');
const { swaggerUi, specs } = require("./swagger");

const app = express();
app.use(express.json());

app.use("/api/users", require("./routes/users"));
app.use("/api/login", require("./routes/login"));

// Middleware Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
*/
/*
// index.js
require('dotenv').config();
const express = require('express');
const { swaggerUi, specs } = require("./swagger");

const app = express();
app.use(express.json());

app.use("/api/users", require("./routes/users"));
app.use("/api/login", require("./routes/login"));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// ❌ ลบ app.listen ออก
// ✅ export app ให้ Vercel
module.exports = app;
*/
require('dotenv').config();
const express = require('express');
const swaggerUi = require("swagger-ui-express");
const { specs } = require("./swagger");

const app = express();
app.use(express.json());

app.use("/api/users", require("./routes/users"));
app.use("/api/login", require("./routes/login"));

/**
 * ✅ expose swagger spec แบบ JSON
 * อันนี้ “ต้องขึ้น” ถ้า backend ทำงาน
 */
app.get("/api/swagger.json", (req, res) => {
  res.json(specs);
});

/**
 * ✅ Swagger UI แบบ custom (รอดหลัง proxy)
 */
app.use(
  "/api/swagger",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "/api/swagger.json",
    },
  })
);

module.exports = app;
