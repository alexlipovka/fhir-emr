import { Organization, Patient, Practitioner } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { User } from 'shared/src/contrib/aidbox';

import {
    sharedAuthorizedOrganization,
    sharedAuthorizedPatient,
    sharedAuthorizedPractitioner,
    sharedAuthorizedUser,
} from 'src/sharedState';

export enum Role {
    Patient = 'patient',
    Admin = 'admin',
    Practitioner = 'practitioner',
    Receptionist = 'receptionist',
    Default = 'default',
}

export function selectUserRole<T>(user: User, options: { [role in Role]: T }): T {
    const userRole = user.role ? user.role![0]!.name : Role.Default;

    return options[userRole];
}

export function matchCurrentUserRole<T>(options: {
    [Role.Patient]: (patient: WithId<Patient>) => T;
    [Role.Admin]: (organization: WithId<Organization>) => T;
    [Role.Practitioner]: (practitioner: WithId<Practitioner>) => T;
    [Role.Receptionist]: (practitioner: WithId<Practitioner>) => T;
    [Role.Default]: (user: User) => T;
}): T {
    return selectUserRole(sharedAuthorizedUser.getSharedState()!, {
        [Role.Patient]: () => options[Role.Patient](sharedAuthorizedPatient.getSharedState()!),
        [Role.Admin]: () => options[Role.Admin](sharedAuthorizedOrganization.getSharedState()!),
        [Role.Practitioner]: () => options[Role.Practitioner](sharedAuthorizedPractitioner.getSharedState()!),
        [Role.Receptionist]: () => options[Role.Receptionist](sharedAuthorizedPractitioner.getSharedState()!),
        [Role.Default]: () => options[Role.Default](sharedAuthorizedUser.getSharedState()!),
    })();
}

export function selectCurrentUserRoleResource(): User | WithId<Patient> | WithId<Practitioner> | WithId<Organization> {
    return matchCurrentUserRole<User | WithId<Patient> | WithId<Practitioner> | WithId<Organization>>({
        [Role.Patient]: (patient) => patient,
        [Role.Admin]: (organization) => organization,
        [Role.Practitioner]: (practitioner) => practitioner,
        [Role.Receptionist]: (practitioner) => practitioner,
        [Role.Default]: (user) => user,
    });
}
