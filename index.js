/*
require("dotenv").config();
const express = require("express");
const { swaggerUi, specs } = require("./swagger");

const app = express();
app.use(express.json());

// routes
app.use("/api/login", require("./routes/login"));
app.use("/api/users", require("./routes/users"));

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
*/



/*
// index.js
require("dotenv").config();
const express = require("express");
const { swaggerUi, specs } = require("./swagger");


const app = express();
app.use(express.json());

// routes
app.use("/api/login", require("./routes/login"));
app.use("/api/users", require("./routes/users"));

// swagger
// เพิ่ม customCssUrl เพื่อแก้ปัญหา CSS ไม่โหลดบน Vercel
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { customCssUrl: CSS_URL })
);

const PORT = process.env.PORT || 3000;

// ปรับแก้ตรงนี้: ใส่เงื่อนไขเพื่อไม่ให้ชนกันเวลา Deploy
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

// สำคัญมาก: ต้อง module.exports app
module.exports = app;
*/


require("dotenv").config();
const express = require("express");
const { swaggerUi, specs } = require("./swagger");

const app = express();
app.use(express.json());

// routes
app.use("/api/login", require("./routes/login"));
app.use("/api/users", require("./routes/users"));

// --- แก้ไขจุดนี้ ---
// ใช้ CDN ทั้ง CSS และ JS เพื่อแก้ปัญหาหน้าขาวบน Vercel/Serverless
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.min.js",
    ],
  })
);
// ----------------

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

module.exports = app;