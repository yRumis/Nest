import { Module } from '@nestjs/common';
import { Recados } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recado])],
  controllers: [Recados],
  providers: [RecadosService],
})
export class RecadosModule {}
