import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import documentsRoutes from './modules/documents/documents.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/uploads/guest-audio', express.static('uploads/guest-audio'));
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error('Error no controlado:', err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(err.causeMessage ? { error: err.causeMessage } : {}),
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

export default app;
