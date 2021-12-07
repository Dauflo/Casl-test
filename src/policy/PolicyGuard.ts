import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Request } from "express"
import { AppAbility, CaslAbilityFactory } from "src/casl/casl-ability.factory"
import { UsersService } from "src/users/users.service"
import { PolicyHandler } from "./IPolicyHandler"

export const CHECK_POLICIES_KEY = 'check_policy'
export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers)

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory, private usersSerivce: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || []

        const request = context.switchToHttp().getRequest<Request>()
        const { user: { username } } = context.switchToHttp().getRequest()
        const user = await this.usersSerivce.findOne(username)

        const ability = this.caslAbilityFactory.createForUser(user)
        return policyHandlers.every((handler) => this.execPolicyHandler(request, handler, ability))
    }

    private execPolicyHandler(request: any, handler: PolicyHandler, ability: AppAbility) {
        if (typeof handler === 'function') {
            return handler(request, ability)
        }
        return handler.handle(ability)
    }
}