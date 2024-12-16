//Routes/productRoutes
const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Notification = require('../models/Notification'); 
const router = express.Router();

// Validar ID de MongoDB
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { name, description, price, quantity, size, imageUrl } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Nombre, precio y cantidad son obligatorios' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      imageUrl,
      size,
    });

    const savedProduct = await newProduct.save();

    // Verificar si el stock es bajo y generar notificación
    if (savedProduct.quantity <= 5) {
      const newNotification = new Notification({
        message: `Catálogo: ${savedProduct.name} tiene menos de 5 unidades.`,
        productImage: savedProduct.imageUrl, 
      });
      await newNotification.save();
      console.log('Notificación guardada en la base de datos');
    }

    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    const updatedData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si el stock es bajo después de la actualización
    if (updatedProduct.quantity <= 5) {
      const newNotification = new Notification({
        message: `Producto: ${updatedProduct.name} tiene 5 o menos unidades.`,
        productImage: updatedProduct.imageUrl, 
      });
      await newNotification.save();
      console.log('Notificación guardada en la base de datos');
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'El término de búsqueda es obligatorio' });
  }

  try {
    const regex = new RegExp(query, 'i'); 
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
    });

    res.json(products);
  } catch (err) {
    console.error('Error en la búsqueda de productos:', err);
    res.status(500).json({ message: 'Error al buscar productos' });
  }
});

router.put('/buy/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    // Buscar el producto y reducir su cantidad
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (product.quantity > 0) {
      product.quantity -= 1; // Reducir la cantidad del stock

      const updatedProduct = await product.save();

      // Verificar si el stock es bajo después de la compra
      if (updatedProduct.quantity <= 5) {
        const newNotification = new Notification({
          message: `Producto: ${updatedProduct.name} tiene 5 o menos unidades.`,
          productImage: updatedProduct.imageUrl, // URL de la imagen del producto
        });
        await newNotification.save();
        console.log('Notificación guardada en la base de datos');
      }

      res.json(updatedProduct);
    } else {
      res.status(400).json({ message: 'Stock insuficiente' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al procesar la compra' });
  }
});

router.post('/buy/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body; // Cantidad de catálogos a comprar

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Cantidad de compra no válida' });
    }

    // Verificar si el ID del catálogo es válido
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID de catálogo inválido' });
    }

    // Buscar el catálogo por ID
    const catalog = await Catalog.findById(id);

    if (!catalog) {
      return res.status(404).json({ message: 'Catálogo no encontrado' });
    }

    // Verificar si hay suficiente stock
    if (catalog.quantity < quantity) {
      return res.status(400).json({ message: 'No hay suficiente stock disponible' });
    }

    // Reducir la cantidad del catálogo
    catalog.quantity -= quantity;
    const updatedCatalog = await catalog.save();

    // Verificar si el stock es bajo después de la compra
    if (updatedCatalog.quantity <= 5) {
      const newNotification = new Notification({
        message: `Catálogo: ${updatedCatalog.name} tiene 5 o menos unidades.`,
        catalogImage: updatedCatalog.imageUrl, 
      });
      await newNotification.save();
      console.log('Notificación guardada en la base de datos');
    }

    res.status(200).json(updatedCatalog); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al procesar la compra' });
  }
});



module.exports = router;
