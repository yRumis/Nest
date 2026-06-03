/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Controller('recados')
export class Recados {
  constructor(private readonly recadosService: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll() {
    return await this.recadosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.recadosService.findOne(id);
  }

  @Post()
  async create(@Body() createBodyDTO: CreateRecadoDto) {
    return await this.recadosService.create(createBodyDTO)
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() UpdateRecadoDto: UpdateRecadoDto) {
    return await this.recadosService.update(id, UpdateRecadoDto);
    
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number){
    return await this.recadosService.remove(id);
  }


}
