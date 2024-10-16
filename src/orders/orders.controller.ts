import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';
 
@Controller('orders') 
export class OrdersController {
  constructor(@Inject('ORDER_SERVICE') private readonly ordersClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {

    try {
      const order = await firstValueFrom(

        this.ordersClient.send('findOneOrder', {id})
      )
      return order;
    } catch (error) {
      throw new RpcException({
        message: 'Order with id ' + id + ' not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  // OPCION 2 PARA BUSCAR TODOS LOS ORDENES CON UN STATUS
  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      

        return this.ordersClient.send('findAllOrders', {
          ...paginationDto,
          status: statusDto.status,
        })
      
      
    } catch (error) {
      throw new RpcException({
        message: 'Order with status ' + statusDto.status + ' not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateStatusOrderDto: StatusDto) {

    return this.ordersClient.send('changeOrderStatus', {id, status:updateStatusOrderDto.status});
  }

}
