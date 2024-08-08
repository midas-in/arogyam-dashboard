import { HumanName } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/humanName';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { dequal } from 'dequal';


/**
 * retrieve object(s) from an array if it has a given property that has a specified value
 *
 * @param objArr - array of objects
 * @param key - the accessor
 * @param value - the value the accessor should have
 * @param all - whether to return all values that are matched or just the first
 */
export const getObjLike = <T extends object>(
    objArr: T[] | undefined,
    key: string,
    value: unknown,
    all = false
) => {
    const arr = objArr ?? [];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const thisObj = arr[i];
        const objHasValue = (thisObj as never)[key];
        if (dequal(objHasValue, value)) {
            result.push(thisObj);
        }
        if (result.length > 0 && !all) {
            return result;
        }
    }
    return result;
};

// fhir constants and  value sets
// fhir constants
// https://www.hl7.org/fhir/valueset-identifier-use.html
export enum IdentifierUseCodes {
    USUAL = 'usual',
    OFFICIAL = 'official',
    TEMP = 'temp',
    SECONDARY = 'secondary',
    OLD = 'old',
}

export enum HumanNameUseCodes {
    USUAL = 'usual',
    OFFICIAL = 'official',
    TEMP = 'temp',
    NICKNAME = 'nickname',
    ANONYMOUS = 'anonymous',
    OLD = 'old',
    MAIDEN = 'maiden',
}

/**
 *  return a single string representing FHIR human name data type
 *
 * @param hName - fhir HumanName object
 */
export const parseFhirHumanName = (hName?: HumanName) => {
    if (!hName) {
        return;
    }
    const { family, given, suffix, prefix } = hName;

    // sanitize variable to make sure its array
    const confirmArray = (element?: unknown) =>
        element ? (Array.isArray(element) ? element : [element]) : [];

    const namesArray = [
        confirmArray(prefix).join(' '),
        confirmArray(given).join(' '),
        confirmArray(family).join(' '),
        confirmArray(suffix).join(' '),
    ].filter((txt) => !!txt);

    return namesArray.join(' ');
};

export function getResourcesFromBundle<TResource>(bundle: IBundle) {
    // eslint-disable-next-line
    const temp = bundle.entry?.filter((x) => x !== undefined);
    const rtn = temp?.map((e) => e.resource as TResource) ?? [];
    return rtn;
}

// get the code of a practitioner resource type
// to be used to determine the resource type
// i.e if it's a practitioner or a supervisor resource type
// handles multiple codeable concept with multiple codings
export const getUserTypeCode = (role: IPractitionerRole) =>
    role.code
        ?.flatMap((code) => code.coding ?? [])
        .find((code) => code.system === USER_TYPE_SYSTEM)?.code as UserTypeCodes;

// get user type from user type code
// export const getUserType = (userTypeCode: string) => {
//     switch (userTypeCode) {
//         case SUPERVISOR_USER_TYPE_CODE:
//             return SUPERVISOR_USER_TYPE_CODE;
//         case REMOTE_SPECIALIST_USER_TYPE_CODE:
//             return REMOTE_SPECIALIST_USER_TYPE_CODE;
//         case SENIOR_SPECIALIST_USER_TYPE_CODE:
//             return SENIOR_SPECIALIST_USER_TYPE_CODE;
//         case READER_USER_TYPE_CODE:
//             return READER_USER_TYPE_CODE;
//         default:
//             return PRACTITIONER;
//     }
// };
// export const PRACTITIONER = "practitioner";
// export const SUPERVISOR = 'supervisor';
// export const REMOTE_SPECIALIST = 'remote-specialist';
// export const SENIOR_SPECIALIST = 'senior-specialist';
// export const READER = 'reader';

export const keycloakIdentifierCoding = {
    system: 'http://hl7.org/fhir/identifier-type',
    code: 'KUID',
    display: 'Keycloak user ID',
};

export const groupResourceType = 'Group';
export const compositionResourceType = 'Composition';
export const practitionerRoleResourceType = 'PractitionerRole';

export const USER_TYPE_SYSTEM = "https://midas.iisc.ac.in/fhir/CodeSystem/practitioner-role-type";
export const SUPERVISOR_USER_TYPE_CODE = 'super-admin';
export const SITE_ADMIN_TYPE_CODE = 'site-admin';
export const SITE_COORDINATOR_USER_TYPE_CODE = 'site-coordinator';
export const PRACTITIONER_USER_TYPE_CODE = 'flw';
export const REMOTE_SPECIALIST_USER_TYPE_CODE = 'specialist';
export const SENIOR_SPECIALIST_USER_TYPE_CODE = 'senior-specialist';
export const READER_USER_TYPE_CODE = 'reader';
export const SNOMED_CODEABLE_SYSTEM = 'http://snomed.info/sct';
export const DEVICE_SETTING_CODEABLE_CODE = '1156600005';

export type UserTypeCodes = typeof SUPERVISOR_USER_TYPE_CODE | typeof SITE_ADMIN_TYPE_CODE | typeof SITE_COORDINATOR_USER_TYPE_CODE | typeof PRACTITIONER_USER_TYPE_CODE | typeof REMOTE_SPECIALIST_USER_TYPE_CODE | typeof SENIOR_SPECIALIST_USER_TYPE_CODE | typeof READER_USER_TYPE_CODE;

export const OBSERVATION_CODE_LABEL_MAPPING: { [key: string]: string } = {
    '63638-1': 'Cigarette/Bidi',
    '39240-7': 'Smokeless Tobacco',
    '64004-5': 'Areca Nut',
    '74205-6': 'Alcohol',
    'LP232821-1': 'Able to open mouth?',
    '62596-2': 'Lesion/Patch'
}

export const OBSERVATION_CODE_LABEL_MAPPING_REVERSE: { [key: string]: string } = {
    'Cigarette/Bidi': '63638-1',
    'Smokeless Tobacco': '39240-7',
    'Areca Nut': '64004-5',
    'Alcohol': '74205-6',
    'Able to open mouth?': 'LP232821-1',
    'Lesion/Patch': '62596-2'
}

export const DIAGNOSIS_RESULTS_MAPPING: { [key: string]: { risk: string, isSuspicious: boolean } } = {
    'oral cavity normal': { risk: 'Low', isSuspicious: false },
    'benign': { risk: 'Low', isSuspicious: false },
    'smokeless tobacco keratosis': { risk: 'Low', isSuspicious: true },
    'homogenous Oral leukoplakia': { risk: 'Low', isSuspicious: true },
    'oral lichen planus': { risk: 'Low', isSuspicious: true },
    'speckled oral leukoplakia': { risk: 'High', isSuspicious: true },
    'erythroplakia': { risk: 'High', isSuspicious: true },
    'verrucous oral leukoplakia': { risk: 'High', isSuspicious: true },
    'proliferative verrucous oral leukoplakia': { risk: 'High', isSuspicious: true },
    'squamous cell carcinoma of oral mucous membrane': { risk: 'High', isSuspicious: true },
}
