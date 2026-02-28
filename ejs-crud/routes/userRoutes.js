const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require(`../controller/userController`)

router.get('/', userController.listUsers);

router.get('/add', userController.addForm);

router.post('/add',
[
    body('name').notEmpty().withMessage("Name required"),
    body('email').isEmail().withMessage("Valid email required"),
    body('phone').notEmpty().withMessage("Phone required"),
    body('image').notEmpty().withMessage("Image required"),
    body('status').optional().isIn(['on']).withMessage('Invalid status value')
],
userController.createUser);

router.get('/edit/:id', userController.editForm);

router.put('/edit/:id',
[
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').notEmpty().withMessage('Phone required'),
    body('image').notEmpty().withMessage('Image required'),
    body('status').optional().isIn(['on']).withMessage('Invalid status value')
],
userController.updateUser);

router.delete('/delete/:id', userController.softDelete);

router.post('/multiple-delete', userController.multipleDelete);

module.exports = router;