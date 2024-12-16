const express = require('express');
const mongoose = require('mongoose');
const Catalog = require('../models/Catalog');
const Notification = require('../models/Notification');

const router = express.Router();

// Validar ID de MongoDB
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener todos los catálogos
router.get('/', async (req, res) => {
  try {
    const catalogs = await Catalog.find();
    res.json(catalogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los catálogos' });
  }
});

// Crear un nuevo catálogo
router.post('/', async (req, res) => {
  try {
    const { name, description, price, quantity, size, imageUrl } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Nombre, precio y cantidad son obligatorios' });
    }

    const newCatalog = new Catalog({
      name,
      description,
      price,
      quantity,
      imageUrl,
      size,
    });

    const savedCatalog = await newCatalog.save();

    // Verificar si el stock es bajo
    if (savedCatalog.quantity <= 5) {
      const newNotification = new Notification({
        message: `Catálogo: ${savedCatalog.name} tiene 5 o menos unidades.`,
        catalogImage: savedCatalog.imageUrl, 
      });
      await newNotification.save();
      console.log('Notificación guardada en la base de datos');
    }

    res.status(201).json(savedCatalog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el catálogo' });
  }
});

// Actualizar un catálogo por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID de catálogo inválido' });
    }

    const updatedData = req.body;
    const updatedCatalog = await Catalog.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedCatalog) {
      return res.status(404).json({ message: 'Catálogo no encontrado' });
    }

    // Verificar si el stock es bajo después de la actualización
    if (updatedCatalog.quantity <= 5) {
      const newNotification = new Notification({
        catalogImage: updatedCatalog.imageUrl, // Enviar la URL de la imagen
        message: `Catálogo: ${updatedCatalog.name} tiene 5 o menos unidades.`,
      });
      await newNotification.save();
      console.log('Notificación guardada en la base de datos');
    }

    res.json(updatedCatalog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el catálogo' });
  }
});

// Eliminar un catálogo por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID de catálogo inválido' });
    }

    const deletedCatalog = await Catalog.findByIdAndDelete(id);

    if (!deletedCatalog) {
      return res.status(404).json({ message: 'Catálogo no encontrado' });
    }

    res.json({ message: 'Catálogo eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el catálogo' });
  }
});

// Ruta para comprar un producto (actualizar stock)
router.put('/buy/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID de catálogo inválido' });
    }

    // Buscar el catálogo por ID
    const catalog = await Catalog.findById(id);
    if (!catalog) {
      return res.status(404).json({ message: 'Catálogo no encontrado' });
    }

    // Verificar si hay suficiente stock
    if (catalog.quantity > 0) {
      catalog.quantity -= 1;  
      await catalog.save();   

      // Verificar si el stock es bajo después de la compra
      if (catalog.quantity <= 5) {
        const newNotification = new Notification({
          message: `Catálogo: ${catalog.name} tiene 5 o menos unidades.`,
          catalogImage: catalog.imageUrl, 
        });
        await newNotification.save();
        console.log('Notificación guardada en la base de datos');
      }

      res.json({ message: 'Compra realizada con éxito', catalog });
    } else {
      res.status(400).json({ message: 'Stock no disponible' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al procesar la compra' });
  }
});

module.exports = router;
