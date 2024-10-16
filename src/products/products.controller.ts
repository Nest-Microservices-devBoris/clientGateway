import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from 'src/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateProductDto } from 'src/common/dto/update-product.dto';


@Controller('products')
export class ProductsController {
  constructor(@Inject('PRODUCT_SERVICE') private readonly productsClient: ClientProxy) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'createProduct'}, createProductDto);
  }

  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'findAll'}, paginationDto);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {

    // return this.productsClient.send({ cmd: 'findOne'}, {id})
    // .pipe(
    //   catchError((error) => {
    //     throw new RpcException(error);
    //   })
    // );
     try {
      
       const product = await firstValueFrom(

         this.productsClient.send({ cmd: 'findOne'}, {id})
       )
       return product;

     } catch (error) {
       throw new RpcException({
         message: 'Product with id ' + id + ' not found',
         status: HttpStatus.BAD_REQUEST,
       });
     }

  }

  @Patch(':id')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto, 
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.productsClient.send(
      { cmd: 'updateProduct'}, 
      {id, ...updateProductDto}
    ).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsClient.send(
      { cmd: 'removeProduct'},
      {id}).pipe(
        catchError((error) => {
          throw new RpcException(error);
        })
      );
  }
}
