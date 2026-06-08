export interface CreateVolunteerDTO {
  userId: string;
  fullName: string;
  phoneNumber: string;
  homeLocation?: string | null;
  operationalRegions: string[];
  bio?: string | null;
  location?: string | null;
  experienceYears?: number | null;
}

export interface UpdateVolunteerDTO {
  fullName?: string;
  phoneNumber?: string;
  homeLocation?: string | null;
  operationalRegions?: string[];
  bio?: string | null;
  location?: string | null;
  experienceYears?: number | null;
  isAvailable?: boolean;
}
