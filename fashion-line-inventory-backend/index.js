//index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const notificationRoutes = require('./Routes/notificationRoutes');
const productRoutes = require('./Routes/productRoutes');
const catalogRoutes = require('./Routes/catalogRoutes');
const Product = require('./models/Product');
const Catalog = require('./models/Catalog');

const app = express();

// Cargar variables de entorno
dotenv.config();

// Configuración de Multer para manejar la carga de imágenes, esto no me funcionó pero me da miedo borrar algo a estas alturas (es lunes)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });


// Conexión a MongoDB   
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.log('Error al conectar a MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Rutas para notificaciones, productos y catálogos
app.use('/api/products', productRoutes);
app.use('/api/catalogs', catalogRoutes);
app.use('/api/notifications', notificationRoutes);

// Ruta para cargar imágenes (si es necesario para operaciones individuales)

// Ruta para obtener productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

// Ruta para obtener catálogos
app.get('/catalogs', async (req, res) => {
    try {
        const catalogs = await Catalog.find();
        res.json(catalogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los catálogos' });
    }
});

// Crear un nuevo producto con imagen
app.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
        }
        const newProduct = await Product.create({ name, description, price, quantity, imageUrl });
        res.json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});

// Crear un nuevo catálogo con imagen
app.post('/catalogs', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
        }
        const newCatalog = await Catalog.create({ name, description, price, quantity, imageUrl });
        res.json(newCatalog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el catálogo' });
    }
});

// Iniciar el servidor
app.listen(process.env.PORT || 5000, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT || 5000}`);
});