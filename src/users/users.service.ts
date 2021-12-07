import { Injectable } from '@nestjs/common';

export class User {
    userId: number
    username: string
    password: string
    permissions?: string[]
}

export class Dashboard {
    id: string
    name: string
}

@Injectable()
export class UsersService {
    private readonly users: User[] = [{
        userId: 1,
        username: 'foo',
        password: 'foo',
        permissions: [
            'read.dashboard.1',
            // 'manage.dashboard.all'
        ]
    }, {
        userId: 2,
        username: 'bar',
        password: 'bar'
    }]

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.password === username)
    }
}
