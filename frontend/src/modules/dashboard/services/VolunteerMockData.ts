export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface VolunteerSchema {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  verificationStatus: VerificationStatus;
  homeLocation: string | null;
  bio: string | null;
  location: string | null;
  experienceYears: number | null;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations (mocked as they would appear in an API response with includes)
  operationalRegions?: Array<{
    id: string;
    volunteerId: string;
    regionName: string;
    createdAt: string;
  }>;
  skills?: Array<{
    id: string;
    volunteerId: string;
    skillId: string;
    level: SkillLevel;
    skill: {
      id: string;
      name: string;
    }
  }>;
}

export const generateMockVolunteers = (): VolunteerSchema[] => {
  return [
    {
      id: 'vol-101',
      userId: 'usr-101',
      fullName: 'Dr. Sarah Jenkins',
      phoneNumber: '+1 555-0101',
      verificationStatus: 'VERIFIED',
      homeLocation: 'North District',
      bio: 'Medical professional with 5 years field experience in crisis zones.',
      location: 'Base Camp Alpha',
      experienceYears: 5,
      isAvailable: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      operationalRegions: [
        { id: 'or-1', volunteerId: 'vol-101', regionName: 'North District', createdAt: new Date().toISOString() }
      ],
      skills: [
        {
          id: 'vs-1', volunteerId: 'vol-101', skillId: 'sk-1', level: 'EXPERT',
          skill: { id: 'sk-1', name: 'Field Medicine' }
        }
      ]
    },
    {
      id: 'vol-102',
      userId: 'usr-102',
      fullName: 'Marcus Thorne',
      phoneNumber: '+1 555-0202',
      verificationStatus: 'PENDING',
      homeLocation: 'East Sector',
      bio: 'Logistics and supply chain specialist.',
      location: 'Warehouse B',
      experienceYears: 8,
      isAvailable: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      operationalRegions: [
        { id: 'or-2', volunteerId: 'vol-102', regionName: 'East Sector', createdAt: new Date().toISOString() }
      ],
      skills: [
        {
          id: 'vs-2', volunteerId: 'vol-102', skillId: 'sk-2', level: 'ADVANCED',
          skill: { id: 'sk-2', name: 'Logistics' }
        }
      ]
    },
    {
      id: 'vol-103',
      userId: 'usr-103',
      fullName: 'Elena Rostova',
      phoneNumber: '+1 555-0303',
      verificationStatus: 'VERIFIED',
      homeLocation: 'West Sector',
      bio: 'Search and rescue operator with heavy machinery certification.',
      location: null,
      experienceYears: 3,
      isAvailable: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      operationalRegions: [
        { id: 'or-3', volunteerId: 'vol-103', regionName: 'West Sector', createdAt: new Date().toISOString() }
      ],
      skills: [
        {
          id: 'vs-3', volunteerId: 'vol-103', skillId: 'sk-3', level: 'ADVANCED',
          skill: { id: 'sk-3', name: 'Search & Rescue' }
        }
      ]
    }
  ];
};
