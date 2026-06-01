/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { RecadosService } from './recados.service';

@Controller('recados')
export class Recados {
  constructor(private readonly recadosService: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.recadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.recadosService.create(body)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.recadosService.update(id, body);
    
  }

  @Delete(':id')
  remove(@Param('id') id: string){
    return this.recadosService.remove(id);
  }


}
