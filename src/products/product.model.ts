import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

});

export interface Product {
    _id: string,
    name: string,
    price: number,
    description: string,
    ownerId: string

}