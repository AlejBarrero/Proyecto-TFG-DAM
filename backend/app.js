import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdfRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// CORS restringido al origen del frontend
app.use(cors({ origin: ALLOWED_ORIGIN }));

app.use('/uploads', express.static('uploads'));
app.use('/api/pdf', pdfRoutes);

// Manejo global de errores no controlados
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// Solo arranca el servidor si este archivo es el punto de entrada (no en tests)
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

export default app;