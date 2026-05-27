const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');

const { env } = require('./config/env');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const { requestLogger } = require('./middleware/requestLogger.middleware');

const authRoutes = require('./routes/auth.routes');
const trackRoutes = require('./routes/track.routes');
const quoteRoutes = require('./routes/quote.routes');
const contactRoutes = require('./routes/contact.routes');
const adminRoutes = require('./routes/admin.routes');
const subscribeRoutes = require('./routes/subscribe.routes');
const documentRoutes = require('./routes/document.routes');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret'],
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(hpp());
app.use(compression());
app.use(requestLogger);
app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'accessiblexpress', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/documents', documentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
