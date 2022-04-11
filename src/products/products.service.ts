import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.model';
import { Model, isValidObjectId, Types } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

    addProduct = async (name: string, price: number, description: string, ownerId: string) => {
        try {
            const newProduct = new this.productModel({ name, price, description, ownerId })
            const createdProduct = await newProduct.save()
            return createdProduct

        }
        catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    getProdcuts = async () => {
        try {
            const products = await this.productModel
                // .find()
                .aggregate([
                    { $match: { price: { $gte: 60 } } },
                    // { $group: { _id: { pr: "$price", name: "$name" }, totalPrice: { $sum: "$price" } } },
                    // { $group: { _id: "$price", count: { $sum: 1 } } },
                    //     { $project: { _id: 0 } },
                    // { $count: "total" }
                    //     { $sort: { "_id.pr": 1 } }
                ])
                .exec()
            return products
        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    getProduct = async (productId: string) => {
        try {
            if (isValidObjectId(productId)) {
                const product = await this.productModel
                    // .aggregate([
                    // { $match: { _id: new Types.ObjectId(productId) } },
                    // { $limit: 1 }
                    // ])
                    .findOne({ _id: productId })
                    .exec()
                if (!product)
                    return new HttpException('Could not find product!', HttpStatus.NOT_FOUND)
                return product
            }
            else {
                return new HttpException('Please enter a valid id!', HttpStatus.BAD_REQUEST)
            }

        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    getProdcutsByOwner = async (ownerId: string) => {
        try {
            const products = await this.productModel
                .aggregate(
                    [

                        {
                            $lookup: {
                                from: this.productModel.collection.name,
                                localField: 'ownerId',
                                foreignField: '_id',
                                as: 'test'
                            }
                        }
                    ]
                )
                // .find({ ownerId })
                .exec()

            return products
        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    updateProduct = async (body: any, productId: string) => {
        try {
            const updateOps = {};
            for (const ops of body) {
                updateOps[ops.propName] = ops.value;
            }
            const updatedProduct = await this.productModel.findOneAndUpdate(
                { _id: productId },
                { $set: updateOps },
                { new: true }
            );
            if (!updatedProduct)
                return new HttpException('Could not find product!', HttpStatus.NOT_FOUND)
            else
                return updatedProduct
        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }



    deleteProduct = async (productId: string) => {
        try {
            if (isValidObjectId(productId)) {
                const product = await this.productModel.deleteOne({ _id: productId }).exec()
                if (!product)
                    return new HttpException('Could not find product!', HttpStatus.NOT_FOUND)
                return { message: 'Deleted successfully!!!' }
            }
            else {
                return new HttpException('Please enter a valid id!', HttpStatus.BAD_REQUEST)
            }

        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
