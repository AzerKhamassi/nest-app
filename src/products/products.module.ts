import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductSchema } from './product.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../auth/user/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])

  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
