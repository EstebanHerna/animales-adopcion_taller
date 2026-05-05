import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, ParseUUIDPipe,
  UploadedFile, UseInterceptors,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
  ApiConsumes, ApiBody,
} from '@nestjs/swagger';

import { AnimalsService }  from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { QueryAnimalsDto } from './dto/query-animals.dto';

@ApiTags('animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @ApiOperation({ summary: 'Listar animales con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { data, total, page, limit }' })
  @Get()
  findAll(@Query() query: QueryAnimalsDto) {
    return this.animalsService.findAll(query);
  }

  @ApiOperation({ summary: 'Obtener un animal por UUID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal encontrado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.animalsService.findOne(id);
  }

  @ApiOperation({ summary: 'Registrar un nuevo animal' })
  @ApiResponse({ status: 201, description: 'Animal creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (validación del DTO)' })
  @ApiResponse({ status: 404, description: 'Location o usuario registrador no encontrado' })
  @Post()
  create(@Body() dto: CreateAnimalDto) {
    return this.animalsService.create(dto);
  }

  @ApiOperation({ summary: 'Actualizar datos de un animal' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal actualizado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAnimalDto) {
    return this.animalsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar un animal' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal eliminado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.animalsService.remove(id);
  }

  @ApiOperation({
    summary: 'Subir o reemplazar la foto del animal',
    description: 'La imagen se sube a Cloudinary. El campo `imagen` del animal se actualiza con la URL HTTPS resultante.',
  })
  @ApiParam({ name: 'id', type: String, description: 'UUID del animal' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['imagen'],
      properties: {
        imagen: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del animal (JPEG, PNG o WebP · máx 2 MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Animal con campo imagen actualizado' })
  @ApiResponse({ status: 400, description: 'Archivo inválido (tipo o tamaño incorrecto)' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })
  @Post(':id/imagen')
  @UseInterceptors(FileInterceptor('imagen'))
  uploadImagen(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2 MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.animalsService.uploadImagen(id, file);
  }
}
