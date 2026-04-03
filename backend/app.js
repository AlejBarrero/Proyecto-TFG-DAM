import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import documentsRoutes from './modules/documents/documents.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: ALLOWED_ORIGIN }));

app.use('/uploads', express.static('uploads'));
app.use('/api/pdf', documentsRoutes);

app.use((err, _req, res, _next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

export default app;
