import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { AdoptionRequestsController } from './adoption-requests.controller';
import { AdoptionRequestsService } from './adoption-requests.service';
import { AdoptionRequest } from './entities/adoption-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdoptionRequest, Animal, User]),
  ],
  controllers: [AdoptionRequestsController],
  providers:   [AdoptionRequestsService],
})
export class AdoptionRequestsModule {}
