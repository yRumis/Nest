import { Module } from '@nestjs/common';
import { Recados } from './recados.controller';
import { RecadosService } from './recados.service';

@Module({
  controllers: [Recados],
  providers: [RecadosService],
})
export class RecadosModule {}
