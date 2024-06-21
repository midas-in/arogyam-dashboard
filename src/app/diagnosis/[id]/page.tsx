'use client';
import { useSession } from "next-auth/react";

import RemoteSpecialistDiagnosis from '@/components/Specialist/DiagnosisMain';
import ReaderDiagnosis from '@/components/Reader/DiagnosisMain';
import { READER, REMOTE_SPECIALIST, SENIOR_SPECIALIST } from '@/utils/fhir-utils';

export default function Diagnosis() {
    const { data: session } = useSession();

    if (!session) {
        return
    }
    if (session?.userType === READER) {
        return <ReaderDiagnosis />
    }

    if (session?.userType === REMOTE_SPECIALIST || session?.userType === SENIOR_SPECIALIST) {
        return <RemoteSpecialistDiagnosis />
    }
}
