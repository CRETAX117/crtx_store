const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const upload = require('../middlewares/upload');
const { productRules, validate } = require('../middlewares/validators');

// Listar productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.render('products/index', {
      title: 'Productos',
      products,
      success: req.query.success,
      error: req.query.error
    });
  } catch (err) {
    res.render('products/index', {
      title: 'Productos',
      products: [],
      error: 'Error al cargar productos'
    });
  }
});

// Formulario crear
router.get('/new', (req, res) => {
  res.render('products/form', {
    title: 'Nuevo Producto',
    product: {},
    isEdit: false
  });
});

// Guardar producto
router.post('/', upload.single('imagen'), productRules, validate, async (req, res) => {
  try {
    if (req.validationErrors) {
      return res.render('products/form', {
        title: 'Nuevo Producto',
        product: req.body,
        isEdit: false,
        errors: req.validationErrors
      });
    }
    const { nombre, precio, descripcion } = req.body;
    const product = new Product({
      nombre,
      precio: parseFloat(precio),
      descripcion,
      imagen: req.file ? req.file.filename : 'default.png'
    });
    await product.save();
    res.redirect('/products?success=Producto creado');
  } catch (err) {
    res.render('products/form', {
      title: 'Nuevo Producto',
      product: req.body,
      isEdit: false,
      errors: ['Error al crear el producto: ' + err.message]
    });
  }
});

// Formulario editar
router.get('/:id/edit', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.redirect('/products?error=Producto no encontrado');
    res.render('products/form', {
      title: 'Editar Producto',
      product,
      isEdit: true
    });
  } catch (err) {
    res.redirect('/products?error=Error al buscar producto');
  }
});

// Actualizar producto
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/products?error=Producto no encontrado');

    product.nombre = req.body.nombre;
    product.precio = parseFloat(req.body.precio);
    product.descripcion = req.body.descripcion;

    // Si sube imagen nueva, borrar la anterior
    if (req.file) {
      if (product.imagen && product.imagen !== 'default.png') {
        const oldPath = path.join(__dirname, '../uploads', product.imagen);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.imagen = req.file.filename;
    }

    await product.save();
    res.redirect('/products?success=Producto actualizado');
  } catch (err) {
    res.redirect('/products?error=Error al actualizar');
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/products?error=Producto no encontrado');

    // Borrar imagen del disco
    if (product.imagen && product.imagen !== 'default.png') {
      const imgPath = path.join(__dirname, '../uploads', product.imagen);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products?success=Producto eliminado');
  } catch (err) {
    res.redirect('/products?error=Error al eliminar');
  }
});

module.exports = router;
