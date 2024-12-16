//Routes/

const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// Obtener todas las notificaciones
router.get('/', async (req, res) => {
  try {
    // Buscar las notificaciones en la base de datos
    const notifications = await Notification.find();
    res.json(notifications); 
  } catch (err) {
    console.error('Error al obtener las notificaciones:', err);
    res.status(500).json({ message: 'Error al obtener las notificaciones' });
  }
});

// Crear una nueva notificación
router.post('/', async (req, res) => {
  try {
    const { message, productImage, catalogImage } = req.body; 
    const newNotification = new Notification({ message, productImage, catalogImage });
    await newNotification.save();
    res.status(201).json(newNotification); 
  } catch (err) {
    console.error('Error al crear la notificación:', err);
    res.status(500).json({ message: 'Error al crear la notificación' });
  }
});

// Eliminar una notificación por su ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la URL
    const deletedNotification = await Notification.findByIdAndDelete(id); 
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }
    res.status(200).json({ message: 'Notificación eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar la notificación:', err);
    res.status(500).json({ message: 'Error al eliminar la notificación' });
  }
});

// Eliminar todas las notificaciones
router.delete('/', async (req, res) => {
  try {
    await Notification.deleteMany();
    res.status(200).json({ message: 'Todas las notificaciones han sido eliminadas' });
  } catch (err) {
    console.error('Error al eliminar todas las notificaciones:', err);
    res.status(500).json({ message: 'Error al eliminar todas las notificaciones' });
  }
});

module.exports = router;
