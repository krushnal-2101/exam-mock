const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.listUsers = async (req, res) => {

    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const query = {
        status: true,
        $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ]
    };

    const total = await User.countDocuments(query);

    const users = await User.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

    res.render('index', {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        search,
        limit
    });
};

exports.addForm = (req, res) => {
    res.render('add', { errors: [] });
};

exports.createUser = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // include previous form values so they can be re-displayed
        return res.render('add', { errors: errors.array(), ...req.body });
    }

    const { name, email, phone, image } = req.body;
    // Checkbox returns 'on' when checked; convert to boolean
    const status = req.body.status === 'on';

    await User.create({
        name,
        email,
        phone,
        image,
        status,
        created_date: new Date().toLocaleString(),
        updated_date: new Date().toLocaleString()
    });

    res.redirect('/');
};

exports.editForm = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('edit', { user, errors: [] });
};

exports.updateUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const user = await User.findById(req.params.id);
        return res.render('edit', { user, errors: errors.array() });
    }

    await User.findByIdAndUpdate(req.params.id, {
        ...req.body,
        updated_date: new Date().toLocaleString()
    });

    res.redirect('/');
};

exports.softDelete = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { status: false });
    res.redirect('/');
};

exports.multipleDelete = async (req, res) => {

    let ids = req.body.ids;

    if (ids) {
        // ensure array
        if (!Array.isArray(ids)) ids = [ids];
        await User.updateMany(
            { _id: { $in: ids } },
            { $set: { status: false } }
        );
    }

    res.redirect('/');
};