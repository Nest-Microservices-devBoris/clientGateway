import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
 
@Controller('orders') 
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {


    try {
      const orders = await firstValueFrom(
        

          this.client.send('findAllOrders', orderPaginationDto)
        
      ) 
      return orders;
    } catch (error) {
      throw new RpcException(error)
      
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {

    try {
      const order = await firstValueFrom(

        this.client.send('findOneOrder', {id})
      )
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // OPCION 2 PARA BUSCAR TODOS LOS ORDENES CON UN STATUS
  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      

        return this.client.send('findAllOrders', {
          ...paginationDto,
          status: statusDto.status,
        })
      
      
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateStatusOrderDto: StatusDto) {

    return this.client.send('changeOrderStatus', {id, status:updateStatusOrderDto.status});
  }

}
