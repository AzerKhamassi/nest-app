import { IsString, IsNumber } from 'class-validator';


export class ProductDto {
    @IsString()
    name: string;
    @IsNumber()
    price: number;

}