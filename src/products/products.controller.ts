import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    async createProduct(@Body() body: ProductDto) {
        const { name, price } = body
        return name
    }


    @Get()
    async getProducts() {
        return { name: 'product', price: '56' }
    }
}
