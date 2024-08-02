import { getAge, formatDate, capitalizeFirstLetter } from "@/utils";
interface Column {
  id: string;
  name: string;
  width: number;
  getValue: (data: any, accessToken?: string, isCsv?: boolean) => any;
}

export const COLUMNS: Column[] = [
  {
    id: 'id',
    name: 'Unique case ID',
    width: 200,
    getValue: (data: any) => data.id
  },
  {
    id: 'meta.lastUpdated',
    name: 'Date of case registered',
    width: 200,
    getValue: (data: any) => formatDate(data.meta.lastUpdated)
  },
  {
    id: 'username',
    name: 'FLW username',
    width: 200,
    getValue: (data: any) => data.generalPractitioner ? data.generalPractitioner[0].reference.split("/")[1] : '-'
  },
  {
    id: 'age',
    name: 'Age',
    width: 200,
    getValue: (data: any) => data.birthDate ? getAge(data?.birthDate) : '-'
  },
  {
    id: 'gender',
    name: 'Gender',
    width: 200,
    getValue: (data: any) => capitalizeFirstLetter(data.gender),
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
  // {
  //   id: 'specialist-diagnosis',
  //   name: 'Specialist diagnosis',
  //   width: 200,
  //   getValue: (data: any) => data.meta.lastUpdated
  // },
  {
    id: 'image-1',
    name: 'Image 1',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 1']
        ? isCsv ? data.images['Image 1'] : <a className='text-primary-400' href={`${data.images['Image 1']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-2',
    name: 'Image 2',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 2']
        ? isCsv ? data.images['Image 2'] : <a className='text-primary-400' href={`${data.images['Image 2']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-3',
    name: 'Image 3',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 3']
        ? isCsv ? data.images['Image 3'] : <a className='text-primary-400' href={`${data.images['Image 3']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-4',
    name: 'Image 4',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 4']
        ? isCsv ? data.images['Image 4'] : <a className='text-primary-400' href={`${data.images['Image 4']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-5',
    name: 'Image 5',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 5']
        ? isCsv ? data.images['Image 5'] : <a className='text-primary-400' href={`${data.images['Image 5']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-6',
    name: 'Image 6',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 6']
        ? isCsv ? data.images['Image 6'] : <a className='text-primary-400' href={`${data.images['Image 6']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-7',
    name: 'Image 7',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 7']
        ? isCsv ? data.images['Image 7'] : <a className='text-primary-400' href={`${data.images['Image 7']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-8',
    name: 'Image 8',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 8']
        ? isCsv ? data.images['Image 8'] : <a className='text-primary-400' href={`${data.images['Image 8']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-9',
    name: 'Image 9',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 9']
        ? isCsv ? data.images['Image 9'] : <a className='text-primary-400' href={`${data.images['Image 9']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-10',
    name: 'Image 10',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 10']
        ? isCsv ? data.images['Image 10'] : <a className='text-primary-400' href={`${data.images['Image 10']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-11',
    name: 'Image 11',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 11']
        ? isCsv ? data.images['Image 11'] : <a className='text-primary-400' href={`${data.images['Image 11']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-12',
    name: 'Image 12',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 12']
        ? isCsv ? data.images['Image 12'] : <a className='text-primary-400' href={`${data.images['Image 12']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
  {
    id: 'image-13',
    name: 'Image 13',
    width: 200,
    getValue: (data: any, accessToken?: string, isCsv?: boolean) => {
      return data.images && data.images['Image 13']
        ? isCsv ? data.images['Image 13'] : <a className='text-primary-400' href={`${data.images['Image 13']}&authToken=${accessToken}`} target='_blank'>view</a>
        : '-'
    }
  },
];