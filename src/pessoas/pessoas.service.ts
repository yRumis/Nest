import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly _pessoaService: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    const pessoaExistente = await this._pessoaService.findOne({
      where: { email: createPessoaDto.email },
    });

    if (pessoaExistente) {
      throw new ConflictException('Email ja cadastrado');
    }
    const pessoaData = {
      nome: createPessoaDto.nome,
      passwordHash: createPessoaDto.password,
      email: createPessoaDto.email,
    };

    const novaPessoa = this._pessoaService.create(pessoaData);
    await this._pessoaService.save(novaPessoa);

    return novaPessoa;
  }

  async findAll() {
    return await this._pessoaService.find({
      order: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const pessoa = await this._pessoaService.findOne({
      where: {
        id,
      },
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa nao encontrada');
    }
    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const partialPessoa = {
      nome: updatePessoaDto.nome,
      password: updatePessoaDto.password,
    };

    const pessoa = await this._pessoaService.preload({
      id,
      ...partialPessoa,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa nao encontrada');
    }

    return await this._pessoaService.update(id, updatePessoaDto);
  }

  async remove(id: number) {
    const pessoa = await this._pessoaService.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new HttpException('pessoa nao existe', HttpStatus.NOT_FOUND);
    }
    return await this._pessoaService.remove(pessoa);
  }
}
