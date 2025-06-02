import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService){}

    async findAll(role?: 'INTERN' | 'ADMIN' | 'ENGINEER') {
        let users;
        if(role) {
            users =  await this.databaseService.users.findMany({
                where:{
                    role,
                }
            });
        } else {
            users = await this.databaseService.users.findMany();
        }     
        return users.map(({ password, updatedAt, ...rest }) => rest);
    }

    async findOne(id: number){
        const user = await this.databaseService.users.findUnique({
            where:{ id, },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        if(!user) throw new NotFoundException('User not found')
        return user
    }

    async create(createUserDto: CreateUserDto){
        const userExist = await this.databaseService.users.findFirst({
            where: {
                OR: [
                    {email: createUserDto.email},
                    {username: createUserDto.username},
                ]
            }
        })
        if(userExist) throw new BadRequestException('User already exist')
        return this.databaseService.users.create({data: createUserDto})
    }

    async update(id: number, updateUserDto: UpdateUserDto){
        return await this.databaseService.users.update({
            where: {
              id,
            },
            data: updateUserDto
          })
    }

    async delete(id: number){
        return await this.databaseService.users.delete({
            where:{
              id,
            }
        })
    }

    async findUserByUsername(username: string){
        const user = await this.databaseService.users.findUnique({
            where:{
              username,
            }
        });

        return user
    }
}
