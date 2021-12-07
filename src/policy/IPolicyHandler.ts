import { ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { AppAbility } from '../casl/casl-ability.factory'

interface IPolicyHandler {
    handle(ability: AppAbility): boolean
}

type PolicyHandlerCallBack = (request: Request, ability: AppAbility) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallBack