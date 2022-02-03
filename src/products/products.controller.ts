import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    async createProduct(@Body() body: ProductDto) {
        const { name, price, description } = body
        return await this.productsService.addProduct(name, price, description)
    }


    @Get()
    async getProducts() {
        return await this.productsService.getProdcuts()
    }

    @Get(':id')
    async getProduct(@Param('id') prodId: string) {
        return await this.productsService.getProduct(prodId)
    }

    @Delete(':id')
    async deleteProduct(@Param('id') prodId: string) {
        return await this.productsService.deleteProduct(prodId)
    }
}
