import { getAge, formatDate, capitalizeFirstLetter } from "@/utils";
interface Column {
  id: string;
  name: string;
  width: number;
  getValue: (data: any, accessToken?: string, isCsv?: boolean) => any;
  siteCoordinatorOnly?: boolean;
}

export const COLUMNS: Column[] = [
  {
    id: 'id',
    name: 'Unique case ID',
    width: 240,
    getValue: (data: any) => data.id
  },
  {
    id: 'meta.lastUpdated',
    name: 'Date of case registered',
    width: 200,
    getValue: (data: any) => data.extension ? formatDate(data.extension[0]?.valueDateTime) : formatDate(data.meta.lastUpdated)
  },
  {
    id: 'username',
    name: 'FLW username',
    width: 200,
    getValue: (data: any) => data.generalPractitioner ? data.generalPractitioner[0].reference.split("/")[1] : '-'
  },
  {
    id: 'first-name',
    name: 'First name',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['First name'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'last-name',
    name: 'Last name',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['Last name'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'ABHA-ID',
    name: 'ABHA ID',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['ABHA ID(Optional)'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'age',
    name: 'Age',
    width: 100,
    getValue: (data: any) => data.birthDate ? getAge(data?.birthDate) : '-'
  },
  {
    id: 'gender',
    name: 'Gender',
    width: 200,
    getValue: (data: any) => capitalizeFirstLetter(data.gender),
  },
  {
    id: 'patient-contact-primary',
    name: 'Primary contact number',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['Primary contact number'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'patient-contact-secondary',
    name: 'Secondary contact number',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['Secondary contact number'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'patient-address-house',
    name: 'House number & street',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['House number & street'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'patient-address-village',
    name: 'Village/Town/Area',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['Village/Town/Area'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'patient-address-pincode',
    name: 'Pincode',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['Pincode'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'patient-address-district',
    name: 'District',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['District'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'patient-address-state',
    name: 'State',
    width: 200,
    getValue: (data: any) => data.basicInfo ? data.basicInfo['State'] || '-' : '-',
    siteCoordinatorOnly: true,
  },
  {
    id: 'cigarette/bidi',
    name: 'Cigarette/Bidi',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.habitHistory['Cigarette/Bidi'] : '-'
  },
  {
    id: 'smokeless-tobacco',
    name: 'Smokeless tobacco',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.habitHistory['Smokeless Tobacco'] : '-'
  },
  {
    id: 'areca-nut',
    name: 'Areca nut',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.habitHistory['Areca Nut'] : '-'
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.habitHistory['Alcohol'] : '-'
  },
  {
    id: 'open-mouth',
    name: 'Able to open mouth',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.oralExaminations['Able to open mouth?'] : '-'
  },
  {
    id: 'lesion-patch',
    name: 'Lesion/patch',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.oralExaminations['Lesion/Patch'] : '-'
  },
  {
    id: 'specialist-diagnosis',
    name: 'Specialist diagnosis',
    width: 200,
    getValue: (data: any) => data.provisionalDiagnosis
  },
  {
    id: 'specialist-recommendation',
    name: 'Specialist recommendation',
    width: 240,
    getValue: (data: any) => data.recommendation
  },
  {
    id: 'image-1',
    name: 'Image 1',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 1']
        ? isCsv ? `${data.images['Image 1']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 1']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-2',
    name: 'Image 2',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 2']
        ? isCsv ? `${data.images['Image 2']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 2']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-3',
    name: 'Image 3',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 3']
        ? isCsv ? `${data.images['Image 3']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 3']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-4',
    name: 'Image 4',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 4']
        ? isCsv ? `${data.images['Image 4']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 4']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-5',
    name: 'Image 5',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 5']
        ? isCsv ? `${data.images['Image 5']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 5']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-6',
    name: 'Image 6',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 6']
        ? isCsv ? `${data.images['Image 6']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 6']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-7',
    name: 'Image 7',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 7']
        ? isCsv ? `${data.images['Image 7']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 7']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-8',
    name: 'Image 8',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 8']
        ? isCsv ? `${data.images['Image 8']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 8']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-9',
    name: 'Image 9',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 9']
        ? isCsv ? `${data.images['Image 9']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 9']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-10',
    name: 'Image 10',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 10']
        ? isCsv ? `${data.images['Image 10']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 10']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-11',
    name: 'Image 11',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 11']
        ? isCsv ? `${data.images['Image 11']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 11']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-12',
    name: 'Image 12',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 12']
        ? isCsv ? `${data.images['Image 12']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 12']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-13',
    name: 'Image 13',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 13']
        ? isCsv ? `${data.images['Image 13']}&authToken=${accessToken}` : <a className='text-primary-400' href={`${data.images['Image 13']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
];