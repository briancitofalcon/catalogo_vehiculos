const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'ep-steep-silence-a4lpwkgh-pooler.us-east-1.aws.neon.tech',
    user: 'neondb_owner',
    password: 'npg_7ohEtfM2WOap',
    database: 'neondb',
    port: 5432, // Cambiar al puerto estándar de PostgreSQL si aplica
    ssl: {
        rejectUnauthorized: false // Desactivar verificación estricta de certificados
    },
    connectTimeout: 10000 // Aumentar el tiempo de espera de conexión
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos.');
    }
});

// Rutas
// Obtener todos los vehículos
app.get('/vehiculos', (req, res) => {
    db.query('SELECT * FROM vehiculos', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// Crear un nuevo vehículo
app.post('/vehiculos', (req, res) => {
    const { tipo, marca, modelo, anio, precio, descripcion, imagen_url } = req.body;
    const query = 'INSERT INTO vehiculos (tipo, marca, modelo, anio, precio, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [tipo, marca, modelo, anio, precio, descripcion, imagen_url];

    db.query(query, values, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send('Vehículo creado exitosamente.');
        }
    });
});

// Actualizar un vehículo
app.put('/vehiculos/:id', (req, res) => {
    const { id } = req.params;
    const { tipo, marca, modelo, anio, precio, descripcion, imagen_url } = req.body;
    const query = 'UPDATE vehiculos SET tipo = ?, marca = ?, modelo = ?, anio = ?, precio = ?, descripcion = ?, imagen_url = ? WHERE id = ?';
    const values = [tipo, marca, modelo, anio, precio, descripcion, imagen_url, id];

    db.query(query, values, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send('Vehículo actualizado exitosamente.');
        }
    });
});

// Eliminar un vehículo
app.delete('/vehiculos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM vehiculos WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send('Vehículo eliminado exitosamente.');
        }
    });
});

// Ruta para autenticación de administrador
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;
    const query = 'SELECT * FROM administradores WHERE usuario = ?';

    db.query(query, [usuario], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else if (results.length === 0) {
            res.status(401).send('Usuario no encontrado.');
        } else {
            const admin = results[0];
            bcrypt.compare(contrasena, admin.contrasena, (err, isMatch) => {
                if (err) {
                    res.status(500).send(err);
                } else if (!isMatch) {
                    res.status(401).send('Contraseña incorrecta.');
                } else {
                    res.status(200).send('Autenticación exitosa.');
                }
            });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});