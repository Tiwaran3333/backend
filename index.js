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