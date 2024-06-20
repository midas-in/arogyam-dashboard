'use client';
import { useSession } from "next-auth/react";

import RemoteSpecialistDiagnosis from '@/components/Specialist/DiagnosisMain';
import ReaderDiagnosis from '@/components/Reader/DiagnosisMain';
import { PRACTITIONER, REMOTE_SPECIALIST, SENIOR_SPECIALIST } from '@/utils/fhir-utils';

export default function Diagnosis() {
    const { data: session } = useSession();

    if (!session) {
        return
    }
    // if (session?.userType === PRACTITIONER) {
    //     return <ReaderDiagnosis />
    // }

    // TODO
    if (session?.userType === REMOTE_SPECIALIST || session?.userType === SENIOR_SPECIALIST) {
    // if (session.userType === PRACTITIONER) {
        return <RemoteSpecialistDiagnosis />
    }
}
