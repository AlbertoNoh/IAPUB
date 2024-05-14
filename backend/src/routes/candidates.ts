import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const port = 3010;

const router = express.Router();
const prisma = new PrismaClient();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
    }
  });
  
  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(null, false); // Cambiado de `new Error('...')` a `undefined`
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  
  
 


// Configuración de multer aquí (igual que antes)

/**
 * @openapi
 * /candidates:
 *   post:
 *     summary: Registra un nuevo candidato
 *     description: Crea un nuevo candidato en el sistema ATS con o sin un documento adjunto.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del candidato
 *                 required: true
 *               surname:
 *                 type: string
 *                 description: Apellido del candidato
 *                 required: true
 *               email:
 *                 type: string
 *                 description: Email del candidato
 *                 required: true
 *               phone:
 *                 type: string
 *                 description: Teléfono del candidato
 *                 required: true
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Documento opcional del candidato (PDF o DOCX)
 *     responses:
 *       201:
 *         description: Candidato registrado exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.post('/', upload.single('document'), async (req, res) => {
    try {
      const { name, surname, email, phone } = req.body;
      const documentPath = req.file ? req.file.path : null;
  
      const candidate = await prisma.candidate.create({
        data: {
          name,
          surname,
          email,
          phone,
          documentPath
        }
      });
  
      res.status(201).json(candidate);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al registrar el candidato');
    }
  });
  
  /**
   * @openapi
   * /candidates:
   *   get:
   *     summary: Lista todos los candidatos
   *     description: Obtiene una lista de todos los candidatos registrados en el sistema, incluyendo la URL del documento si existe.
   *     responses:
   *       200:
   *         description: Lista de candidatos obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     description: El ID del candidato
   *                   name:
   *                     type: string
   *                     description: Nombre del candidato
   *                   surname:
   *                     type: string
   *                     description: Apellido del candidato
   *                   email:
   *                     type: string
   *                     description: Email del candidato
   *                   phone:
   *                     type: string
   *                     description: Teléfono del candidato
   *                   documentUrl:
   *                     type: string
   *                     description: URL del documento del candidato
   *       500:
   *         description: Error en el servidor
   */
  router.get('/', async (req, res) => {
    try {
      const candidates = await prisma.candidate.findMany();
      const candidatesWithDocumentUrl = candidates.map(candidate => ({
        ...candidate,
        documentUrl: candidate.documentPath ? `http://localhost:${port}/${candidate.documentPath}` : null
      }));
      res.json(candidatesWithDocumentUrl);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los candidatos');
    }
  });
  
  /**
   * @openapi
   * /candidates/{id}:
   *   get:
   *     summary: Obtiene los datos de un candidato específico
   *     description: Retorna los detalles de un candidato por su ID, incluyendo la URL del documento si existe.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del candidato
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Datos del candidato obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 surname:
   *                   type: string
   *                 email:
   *                   type: string
   *                 phone:
   *                   type: string
   *                 documentUrl:
   *                   type: string
   *                   description: URL del documento del candidato
   *       404:
   *         description: Candidato no encontrado
   *       500:
   *         description: Error en el servidor
   */
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const candidate = await prisma.candidate.findUnique({
        where: { id: parseInt(id) }
      });
  
      if (!candidate) {
        res.status(404).send('Candidato no encontrado');
        return;
      }
  
      const candidateWithDocumentUrl = {
        ...candidate,
        documentUrl: candidate.documentPath ? `http://localhost:${port}/${candidate.documentPath}` : null
      };
  
      res.json(candidateWithDocumentUrl);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos del candidato');
    }
  });
  
  
  /**
   * @openapi
   * /candidates/{id}:
   *   put:
   *     summary: Edita los datos de un candidato
   *     description: Actualiza los datos de un candidato por su ID, incluyendo la actualización del documento si se proporciona uno nuevo.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del candidato
   *         schema:
   *           type: integer
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Nombre del candidato
   *               surname:
   *                 type: string
   *                 description: Apellido del candidato
   *               email:
   *                 type: string
   *                 description: Email del candidato
   *               phone:
   *                 type: string
   *                 description: Teléfono del candidato
   *               document:
   *                 type: string
   *                 format: binary
   *                 description: Documento opcional del candidato (PDF o DOCX)
   *     responses:
   *       200:
   *         description: Datos del candidato actualizados exitosamente
   *       404:
   *         description: Candidato no encontrado
   *       500:
   *         description: Error en el servidor
   */
  router.put('/:id', upload.single('document'), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, surname, email, phone } = req.body;
      const documentPath = req.file ? req.file.path : null;
  
      const existingCandidate = await prisma.candidate.findUnique({
        where: { id: parseInt(id) }
      });
  
      if (!existingCandidate) {
        res.status(404).send('Candidato no encontrado');
        return;
      }
  
      // Si hay un nuevo documento, eliminar el anterior si existe
      if (documentPath && existingCandidate.documentPath) {
        const fs = require('fs');
        const path = require('path');
        fs.unlinkSync(path.resolve(existingCandidate.documentPath));
      }
  
      const updatedCandidate = await prisma.candidate.update({
        where: { id: parseInt(id) },
        data: {
          name,
          surname,
          email,
          phone,
          documentPath: documentPath || existingCandidate.documentPath
        }
      });
  
      res.json(updatedCandidate);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar los datos del candidato');
    }
  });
  
  
  /**
   * @openapi
   * /candidates/{id}:
   *   delete:
   *     summary: Elimina un candidato
   *     description: Elimina los datos de un candidato por su ID, incluyendo su documento asociado si existe.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del candidato
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Candidato eliminado exitosamente
   *       404:
   *         description: Candidato no encontrado
   *       500:
   *         description: Error en el servidor
   */
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const candidate = await prisma.candidate.findUnique({
        where: { id: parseInt(id) }
      });
  
      if (!candidate) {
        res.status(404).send('Candidato no encontrado');
        return;
      }
  
      // Eliminar el documento si existe
      if (candidate.documentPath) {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.resolve(candidate.documentPath);
        fs.unlinkSync(filePath);
      }
  
      // Eliminar el registro del candidato
      await prisma.candidate.delete({
        where: { id: parseInt(id) }
      });
  
      res.send('Candidato eliminado exitosamente');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el candidato');
    }
  });

export default router;