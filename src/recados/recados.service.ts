import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly _recadoRepository: Repository<Recado>,
  ) {}

  async findAll() {
    const recados = await this._recadoRepository.find();
    return recados;
  }

  async findOne(id: number) {
    const recados = await this._recadoRepository.findOne({
      where: {
        id,
      },
    });
    if (!recados) {
      throw new HttpException('usuario nao encontrado', HttpStatus.NOT_FOUND);
    }
    return recados;
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const { texto, de, para } = createRecadoDto;

    const novoRecado = await this._recadoRepository
      .createQueryBuilder()
      .insert()
      .into(Recado)
      .values({
        texto,
        de,
        para,
      })
      .execute();

    return this._recadoRepository.findOneBy({
      id: novoRecado.identifiers[0].id as number,
    });
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdate = {
      texto: updateRecadoDto?.texto,
      lido: updateRecadoDto?.lido,
    };
    const recadoExiste = await this._recadoRepository.update(id, partialUpdate);

    if (recadoExiste.affected === 0) {
      throw new NotFoundException('usuario nao encontrado');
    }
    return this._recadoRepository.findOneBy({
      id,
    });
  }

  async remove(id: number) {
    const recado = await this._recadoRepository.findOneBy({
      id,
    });

    if (!recado) {
      throw new HttpException('recado nao existe', HttpStatus.NOT_FOUND);
    }
    return await this._recadoRepository.remove(recado);
  }
}
