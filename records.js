/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all export records
 *     tags:
 *       - Records
 *     responses:
 *       200:
 *         description: List of export records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vehicle:
 *                     type: string
 *                   client:
 *                     type: string
 *                   destination:
 *                     type: string
 *                   date:
 *                     type: string
 */
const express = require('express');