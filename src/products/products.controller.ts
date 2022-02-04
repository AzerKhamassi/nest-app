import { Body, Controller, Get, Post, Param, Delete, UseGuards, Request, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createProduct(@Body() body: ProductDto, @Request() req) {
        const { name, price, description } = body
        return await this.productsService.addProduct(name, price, description, req.user.userId)
    }


    @Get()
    async getProducts() {
        return await this.productsService.getProdcuts()
    }

    @UseGuards(JwtAuthGuard)
    @Get('owner')
    async getProductByOwner(@Request() req) {
        return await this.productsService.getProdcutsByOwner(req.user.userId)
    }

    @Get(':id')
    async getProduct(@Param('id') prodId: string) {
        return await this.productsService.getProduct(prodId)
    }



    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateProduct(@Param('id') prodId: string, @Body() Body) {
        return await this.productsService.updateProduct(Body, prodId)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteProduct(@Param('id') prodId: string) {
        return await this.productsService.deleteProduct(prodId)
    }
}
