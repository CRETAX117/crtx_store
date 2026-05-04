const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { isAuthenticated } = require('./middlewares/auth');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();

// Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    eq: (a, b) => a === b
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// Pasar datos de sesion a todas las vistas
app.use((req, res, next) => {
  res.locals.isAuthenticated = !!(req.session && req.session.userId);
  res.locals.username = req.session ? req.session.username : null;
  next();
});

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/auth', authRoutes);
app.use('/products', isAuthenticated, productRoutes);

// Chat (protegido)
app.get('/chat', isAuthenticated, async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(50).lean();
  messages.reverse();
  res.render('chat', {
    title: 'Chat',
    messages,
    currentUser: req.session.username
  });
});

app.get('/', (req, res) => res.redirect('/products'));

// Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado al chat');

  socket.on('chatMessage', async (data) => {
    try {
      const msg = new Message({
        user: data.user,
        message: data.message
      });
      await msg.save();
      io.emit('newMessage', {
        user: msg.user,
        message: msg.message,
        timestamp: msg.timestamp
      });
    } catch (err) {
      console.error('Error guardando mensaje:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado del chat');
  });
});

// Arrancar
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
