import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permission/schemas/permission.schema';
import { Role, RoleDocument } from './../role/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSION, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);

    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,
        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,
        private configService: ConfigService,
        private usersService: UsersService
        
    ) {
           
    }
    
    async onModuleInit() {
        const isInit = this.configService.get<string>("SHOULD_INIT");
        if(Boolean(isInit)){
            const countUser = await this.userModel.countDocuments({});
            const countPermission = await this.permissionModel.countDocuments({});
            const countRole = await this.roleModel.countDocuments({});

            if(countPermission === 0){
                await this.permissionModel.insertMany(INIT_PERMISSION);
            }
            if(countRole === 0){
                const permissionsAdmin = await this.permissionModel.find({}).select("_id");
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: "Admin full permissions",
                        isActive: true,
                        permissions: permissionsAdmin

                    },
                    {
                        name: USER_ROLE,
                        description: "User have not permissions",
                        isActive: true,
                        permissions: []

                    }
                ]);
            }

            if(countUser === 0){
                const adminRole = await this.roleModel.findOne({name: ADMIN_ROLE});
                const userRole = await this.roleModel.findOne({name: USER_ROLE});
                await this.userModel.insertMany([
                    {
                        name: 'Admin',
                        email: "admin@gmail.com",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 99,
                        gender: "OTHER",
                        address: "VIETNAM",
                        role: adminRole?._id
                    },
                    {
                        name: 'user',
                        email: "user@gmail.com",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 99,
                        gender: "OTHER",
                        address: "VIETNAM",
                        role: userRole?._id
                    },
                    {
                        name: 'YangLake',
                        email: "yang@gmail.com",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 99,
                        gender: "OTHER",
                        address: "VIETNAM",
                        role: adminRole?._id
                    }
                ])
            }
            if(countUser > 0 && countRole > 0 &&countPermission > 0){
                this.logger.log('ALREADY INIT DATA >>>');
                
                
            }
        }
        
    }
}
