import joi from "joi";
import db from "../db/database.js";

// addProduct, updateProduct, deleteProduct, addCampaignOffer

const addProductSchema = joi.object({
    title: joi.string().min(3).max(30).required(),
    desc: joi.string().min(5).max(200).required(),
    price: joi.number().required()
});

const updateProductSchema = joi.object({
    _id: joi.number().required(),
    title: joi.string().min(3).max(30),
    desc: joi.string().min(5).max(200),
    price: joi.number()
});

const deleteProductSchema = joi.object({
    productId: joi.number().required()
});

const addCampaignOfferSchema = joi.object({
    ids: joi.array().items(joi.number()).required(),
    price: joi.number().required()
})

export const addProduct = async(req, res) => {
    const { error } = addProductSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
        title,
        desc,
        price
    } = req.body

    try {
        const newId = Number((await db.menu.findOne().sort({ _id: -1 }))?._id) + 1 || 1
        const insertRes = await db.menu.insert({
            _id: newId,
            title,
            desc,
            price,
            createdAt: Date.now(),
            modifiedAt: Date.now()
        })
    
        res.status(201).json({
            message: "Product added.",
            product: insertRes
        })
    }
    catch (err) {
        res.status(500).send("Could not add product.");
    }
}

export const updateProduct = async(req, res) => {
    const { error } = updateProductSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const {
            _id,
            ...fields
        } = req.body
    
        const updateRes = await db.menu.update({ _id }, { 
            $set: {
                ...fields,
                modifiedAt: Date.now()
            } 
        })
    
        res.status(updateRes > 0 ? 200 : 404).json({
            updateStatus: updateRes > 0
        })
    }
    catch (err) {
        res.status(500).send("Could not update product.");
    }
}

export const deleteProduct = async(req, res) => {
    const { error } = deleteProductSchema.validate(req.params);
    if (error) return res.status(400).send(error.details[0].message);

    const { productId } = req.params;

    try {
        const deleteRes = await db.menu.remove({ _id: Number(productId) });
    
        res.status(deleteRes > 0 ? 200 : 404).json({
            deleteStatus: deleteRes > 0
        })
    }
    catch (err) {
        res.status(500).send("Could not delete product.");
    }
}

export const addCampaignOffer = async(req, res) => {
    const { error } = addCampaignOfferSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
        ids,
        price
    } = req.body

    try {
        const menuItems = await db.menu.find({
            _id: {
                $in: ids
            }
        })

        if (menuItems.length !== ids.length) {
            return res.status(400).send("Invalid ids sent.")
        }

        const newId = Number((await db.campaigns.findOne().sort({ _id: -1 }))?._id) + 1 || 1
        const insertRes = await db.campaigns.insert({
            _id: newId,
            ids,
            price
        })
    
        res.status(201).json({
            message: "Campaign added.",
            campaign: insertRes
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Could not add campaign.");
    }
}