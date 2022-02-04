import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.model';
import { Model, isValidObjectId } from 'mongoose';

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
            const products = await this.productModel.find().exec()
            return products
        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    getProduct = async (productId: string) => {
        try {
            if (isValidObjectId(productId)) {
                const product = await this.productModel.findOne({ _id: productId }).exec()
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
            const products = await this.productModel.find({ ownerId }).exec()
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
