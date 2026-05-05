import {
  Body, Controller, Delete, Get,
  Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
import {
  ApiOperation, ApiParam, ApiResponse, ApiTags,
} from '@nestjs/swagger';

import { AdoptionRequestsService }   from './adoption-requests.service';
import { CreateAdoptionRequestDto }  from './dto/create-adoption-request.dto';
import { UpdateAdoptionStatusDto }   from './dto/update-adoption-request.dto';

@ApiTags('adoption-requests')
@Controller('adoption-requests')
export class AdoptionRequestsController {
  constructor(private readonly adoptionRequestsService: AdoptionRequestsService) {}

  @ApiOperation({
    summary: 'Crear solicitud de adopción',
    description:
      'El animal debe estar en estado **disponible**. ' +
      'No se permiten solicitudes duplicadas del mismo usuario para el mismo animal.',
  })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Animal ya adoptado o solicitud duplicada' })
  @ApiResponse({ status: 404, description: 'Animal o usuario no encontrado' })
  @Post()
  create(@Body() dto: CreateAdoptionRequestDto) {
    return this.adoptionRequestsService.create(dto);
  }

  @ApiOperation({ summary: 'Listar todas las solicitudes de adopción' })
  @ApiResponse({ status: 200, description: 'Array de solicitudes' })
  @Get()
  findAll() {
    return this.adoptionRequestsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una solicitud por UUID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionRequestsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Aprobar o rechazar una solicitud',
    description:
      'Al **aprobar** una solicitud, el animal pasa automáticamente a estado `adoptado`.',
  })
  @ApiParam({ name: 'id', type: String, description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Estado de la solicitud actualizado' })
  @ApiResponse({ status: 400, description: 'Estado inválido (solo aprobada | rechazada)' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdoptionStatusDto,
  ) {
    return this.adoptionRequestsService.updateStatus(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar una solicitud de adopción' })
  @ApiParam({ name: 'id', type: String, description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud eliminada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionRequestsService.remove(id);
  }
}
