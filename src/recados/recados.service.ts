import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Recado } from './entities/recado.entity';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Este eh um recado de teste',
      de: 'Jonatas',
      para: 'miguel',
      lido: false,
      data: new Date(),
    },
  ];

  findAll() {
    return this.recados;
  }

  findOne(id: string) {
    const recados = this.recados.find((data) => data.id === +id);
    if (!recados) {
      throw new HttpException('usuario nao encontrado', HttpStatus.NOT_FOUND);
    }
    return recados;
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const novoRecado = {
      id,
      ...body,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.recados.push(novoRecado);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return novoRecado;
  }

  update(id: string, body: any) {
    const recadoExisteIndex = this.recados.findIndex((data) => data.id === +id);

    if (recadoExisteIndex < 0) {
      throw new HttpException('usuario nao encontrado', HttpStatus.NOT_FOUND);
    }

    if (recadoExisteIndex >= 0) {
      const recadoExistente = this.recados[recadoExisteIndex];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, prettier/prettier
      return this.recados[recadoExisteIndex] = {
        ...recadoExistente,
        ...body,
        // eslint-disable-next-line prettier/prettier
      };
    }
  }

  remove(id: string) {
    const deletarIndex = this.recados.findIndex((index) => index.id === +id);

    if (deletarIndex < 0) {
      throw new HttpException('usuario nao encontrado', HttpStatus.NOT_FOUND);
    }

    const result = this.recados[deletarIndex];

    if (deletarIndex >= 0) {
      this.recados.splice(deletarIndex, 1);
    }

    return { message: 'user deletado com sucesso', user: result };
  }
}
