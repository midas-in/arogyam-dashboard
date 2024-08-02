import { stringify } from 'csv-stringify/sync';
import { NextResponse } from 'next/server';
import { fetchReports } from '@/app/loader';
import { getResourcesFromBundle } from '@/utils/fhir-utils';
import { COLUMNS } from '@/components/Admin/Reports/ReportColumnConfig';

export async function POST(request: any) {
    const accessToken = request.headers.get('Authorization')?.split(' ')[1];
    const userType = request.headers.get('userType');

    if (!accessToken) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { params } = body;

    const allCases = [];
    let page = 1, limit = 50;
    let hasMore = true;
    const countData = await fetchReports(accessToken, { ...params, _summary: 'count' });

    while (hasMore) {
        const data = await fetchReports(accessToken, {
            ...params,
            _count: limit,
            _getpagesoffset: (page - 1) * limit,
        });
        const allData = getResourcesFromBundle<any>(data);
        const cases = allData.filter(d => d.resourceType === 'Patient');
        cases.forEach(c => {
            const questionnaireResponse = allData.find(d => {
                return d.resourceType === "QuestionnaireResponse" &&
                    d.subject.reference === `Patient/${c.id}` &&
                    d.questionnaire === 'Questionnaire/OralCancerPatientRegistration'
            });
            if (questionnaireResponse) {
                // Extract basic info question answers
                const basicInfoGroup = questionnaireResponse?.item.find((i: any) => i.linkId === 'basic-info-group');
                const basicInfo = basicInfoGroup?.item.reduce((prev: any, curr: any) => {
                    return Object.assign({}, prev, { [curr.text]: curr.answer ? curr.answer[0].valueCoding?.display ?? curr.answer[0].valueString : '' });
                }, {});
                c.basicInfo = basicInfo;
                // Extract habit history question answers
                const habitHistoryGroup = questionnaireResponse?.item.find((i: any) => i.linkId === 'habit-history-group');
                const habitHistory = habitHistoryGroup?.item.reduce((prev: any, curr: any) => {
                    return Object.assign({}, prev, { [curr.text]: curr.answer ? curr.answer[0].valueCoding?.display : '' });
                }, {});
                c.habitHistory = habitHistory;
                // Extract screening info like oral examination and images
                const screeningGroup = questionnaireResponse?.item.find((i: any) => i.linkId === 'screening-group');
                const screeningOralExamination = screeningGroup?.item.find((i: any) => i.linkId === 'patient-screening-question-group');
                const oralExaminations = screeningOralExamination?.item.reduce((prev: any, curr: any) => {
                    return Object.assign({}, prev, { [curr.text]: curr.answer ? curr.answer[0].valueCoding?.display : '' });
                }, {});
                c.oralExaminations = oralExaminations;
                const screeningImages = screeningGroup?.item.find((i: any) => i.linkId === 'patient-screening-image-group');
                const images = screeningImages?.item.reduce((prev: any, curr: any) => {
                    return Object.assign({}, prev, { [curr.text]: curr.answer ? curr.answer[0].valueAttachment?.url : '' });
                }, {});
                c.images = images;
            }
        })

        allCases.push(...cases);

        hasMore = allCases.length < countData.total;
        page++;
    }

    const filteredColumn = COLUMNS.filter(c => userType !== 'site-coordinator' ? !c.siteCoordinatorOnly : true);

    const csvData = stringify([
        filteredColumn.map((column) => column.name),
        ...allCases.map(report => {
            return filteredColumn.map((column) => {
                return column.getValue(report, accessToken, true) ?? '-'
            })
        })
    ]);

    return new NextResponse(csvData, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=cases.csv',
        },
    });
}
