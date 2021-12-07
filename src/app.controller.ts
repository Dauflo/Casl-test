import { Controller, ExecutionContext, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth/auth.service';
import { Action, AppAbility } from './casl/casl-ability.factory';
import { CheckPolicies, PoliciesGuard } from './policy/PolicyGuard';
import { Dashboard } from './users/users.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

  @Get('permission/:id')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((request: ExpressRequest, ability: AppAbility) => {
    const { id } = request.params
    const dash = new Dashboard()
    dash.id = id
    return ability.can('manage', dash)
  })
  find(@Param('id') id: string) {
    return { message: 'ok' }
  }
}
