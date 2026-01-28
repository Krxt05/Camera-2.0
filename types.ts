export interface Booking {
  model: string;
  start: Date;
  end: Date;
}

export interface CameraModel {
  id: string;
  shortName: string;
  fullName: string;
  heroImage: string;
  moodImages: string[];
}

export type BookingStatus = 'available' | 'busy';

export const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjQW_nvu3CR0SZIPcPVs9eVXVDjJPMDUJeZUciKbnqABBzxGF6YJI_Fq09i-oemUur88KkoUoOF47R/pub?gid=0&single=true&output=csv";
