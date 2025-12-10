import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// -------------------
// MongoDB Connection
// -------------------
mongoose.connect('mongodb://127.0.0.1:27017/global_vehicle')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB error:', err));

// -------------------
// Routes
// -------------------
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("API Running");
});

// -------------------
// Swagger Setup
// -------------------
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Global Vehicle Export Management System API",
      version: "1.0.0",
      description: "API documentation for GVEMS",
    },
    servers: [
      { url: "http://localhost:5000" },
    ],
  },
  apis: ["./server.js", "./src/routes/*.js"], // all route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// -------------------
// Start Server
// -------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
