import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto

    const hashedPassword = await hash(password);
    return await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...user
      }
    })

  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }
}
