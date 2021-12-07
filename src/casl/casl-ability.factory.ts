import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Dashboard, User } from "src/users/users.service";

type Subjects = InferSubjects<typeof Dashboard | typeof User> | 'all'

export type Action = 'manage' | 'read'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)

        user.permissions.forEach(perm => {
            const [action, ressource, ressourceId] = perm.split('.')

            const condition = ressourceId === 'all' ? {} : { id: ressourceId }

            switch (ressource) {
                case 'dashboard':
                    can(action as Action, Dashboard, condition)
                    break
            }
        })

        return build({
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
        })
    }
}
