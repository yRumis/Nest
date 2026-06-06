import {
  HttpException,
  HttpStatus,
  Injectable,
  //NotFoundException,
} from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly _recadoRepository: Repository<Recado>,
    private readonly _pessoasService: PessoasService,
  ) {}

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto ?? {};
    const recados = await this._recadoRepository.find({
      take: limit,
      skip: offset,
      relations: {
        de: true,
        para: true,
      },
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recados;
  }

  async findOne(id: number) {
    const recados = await this._recadoRepository.findOne({
      where: {
        id,
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    if (!recados) {
      throw new HttpException('usuario nao encontrado', HttpStatus.NOT_FOUND);
    }
    return recados;
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const { deId, paraId } = createRecadoDto;

    const de = await this._pessoasService.findOne(deId);

    const para = await this._pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };

    const recado = this._recadoRepository.create(novoRecado);
    await this._recadoRepository.save(recado);

    return {
      ...recado,
      de: {
        id: recado.de.id,
      },
      para: {
        id: recado.para.id,
      },
    };
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const recado = await this.findOne(id);
    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido ?? recado.lido;

    await this._recadoRepository.save(recado);
    return recado;
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
