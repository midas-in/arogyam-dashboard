'use client';
import { useSession } from "next-auth/react";

import RemoteSpecialistDiagnosis from '@/components/Specialist/DiagnosisMain';
import ReaderDiagnosis from '@/components/Reader/DiagnosisMain';
import { READER_USER_TYPE_CODE, REMOTE_SPECIALIST_USER_TYPE_CODE, SENIOR_SPECIALIST_USER_TYPE_CODE } from '@/utils/fhir-utils';

export default function Diagnosis() {
    const { data: session } = useSession();

    if (!session) {
        return
    }
    if (session?.userType === READER_USER_TYPE_CODE) {
        return <ReaderDiagnosis />
    }

    if (session?.userType === REMOTE_SPECIALIST_USER_TYPE_CODE || session?.userType === SENIOR_SPECIALIST_USER_TYPE_CODE) {
        return <RemoteSpecialistDiagnosis />
    }
}
