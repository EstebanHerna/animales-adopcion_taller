import {
  Body, Controller, Delete, Get,
  Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
import {
  ApiOperation, ApiParam, ApiResponse, ApiTags,
} from '@nestjs/swagger';

import { UsersService }    from './users.service';
import { CreateUserDto }   from './dto/create-user.dto';
import { UpdateUserDto }   from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Array de usuarios' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un usuario por UUID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  // ─── Favoritos (ManyToMany) ───────────────────────────────

  @ApiOperation({ summary: 'Agregar animal a favoritos del usuario' })
  @ApiParam({ name: 'id',       type: String, description: 'UUID del usuario' })
  @ApiParam({ name: 'animalId', type: String, description: 'UUID del animal' })
  @ApiResponse({ status: 201, description: 'Animal agregado a favoritos' })
  @ApiResponse({ status: 404, description: 'Usuario o animal no encontrado' })
  @Post(':id/favorites/:animalId')
  addFavorite(
    @Param('id',       ParseUUIDPipe) userId:   string,
    @Param('animalId', ParseUUIDPipe) animalId: string,
  ) {
    return this.usersService.addFavorite(userId, animalId);
  }

  @ApiOperation({ summary: 'Listar animales favoritos del usuario' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Array de animales favoritos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id/favorites')
  getFavorites(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getFavorites(id);
  }

  @ApiOperation({ summary: 'Quitar animal de favoritos del usuario' })
  @ApiParam({ name: 'id',       type: String, description: 'UUID del usuario' })
  @ApiParam({ name: 'animalId', type: String, description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal removido de favoritos' })
  @ApiResponse({ status: 404, description: 'Usuario o animal no encontrado' })
  @Delete(':id/favorites/:animalId')
  removeFavorite(
    @Param('id',       ParseUUIDPipe) userId:   string,
    @Param('animalId', ParseUUIDPipe) animalId: string,
  ) {
    return this.usersService.removeFavorite(userId, animalId);
  }
}
