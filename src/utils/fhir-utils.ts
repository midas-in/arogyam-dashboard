import { HumanName } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/humanName';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { isEqual } from 'lodash';

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
        if (isEqual(objHasValue, value)) {
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
        .find((code) => code.system === USER_TYPE_SYSTEM)?.code;

// get user type from user type code
export const getUserType = (userTypeCode: string) => {
    switch (userTypeCode) {
        case SUPERVISOR_USER_TYPE_CODE:
            return SUPERVISOR;
        case REMOTE_SPECIALIST_USER_TYPE_CODE:
            return REMOTE_SPECIALIST;
        case SENIOR_SPECIALIST_USER_TYPE_CODE:
            return SENIOR_SPECIALIST;
        case READER_USER_TYPE_CODE:
            return READER;
        default:
            return PRACTITIONER;
    }
};

export const keycloakIdentifierCoding = {
    system: 'http://hl7.org/fhir/identifier-type',
    code: 'KUID',
    display: 'Keycloak user ID',
};

export const groupResourceType = 'Group';
export const compositionResourceType = 'Composition';
export const practitionerRoleResourceType = 'PractitionerRole';

export const PRACTITIONER = "practitioner";
export const SUPERVISOR = 'supervisor';
export const REMOTE_SPECIALIST = 'remote-specialist';
export const SENIOR_SPECIALIST = 'senior-specialist';
export const READER = 'reader';

export const USER_TYPE_SYSTEM = "https://midas.iisc.ac.in/fhir/CodeSystem/practitioner-role-type";
export const SUPERVISOR_USER_TYPE_CODE = 'super-admin';
export const PRACTITIONER_USER_TYPE_CODE = 'flw';
export const REMOTE_SPECIALIST_USER_TYPE_CODE = 'specialist'; //TODO update code
export const SENIOR_SPECIALIST_USER_TYPE_CODE = 'senior-specialist'; //TODO update code
export const READER_USER_TYPE_CODE = 'reader'; //TODO update code
export const SNOMED_CODEABLE_SYSTEM = 'http://snomed.info/sct';
export const DEVICE_SETTING_CODEABLE_CODE = '1156600005';

export const OBSERVATION_CODE_LABEL_MAPPING: { [key: string]: string } = {
    '63638-1': 'Smoking status',
    '39240-7': 'Tobacco use status',
    '64004-5': 'Tobacco product',
    '74205-6': 'Alcohol use',
    '62559-0': 'Lifetime alcohol exposure',
    'LP232821-1': 'Open mouth',
    '62596-2': 'Oral mucosal lesions'
}
