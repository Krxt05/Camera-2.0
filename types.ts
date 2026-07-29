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

export const ADMIN_API_URL = "https://script.google.com/macros/s/AKfycbwq1wGnUIGcpGSePlS3NZyM3TaqMTTEdXdqfRhTdL57pIjK85t99KDK7XNk1v0ck-k/exec";

export const CAMERA_FULL_NAMES = [
  "Canon IXY 10s",
  "Canon IXY 30s",
  "Canon IXY 930 IS",
  "Canon IXY 510 IS",
  "Canon IXY 910 IS",
  "Canon IXY 200 (IXUS 185)",
];

export const CAMERA_SHORT_NAMES: Record<string, string> = {
  "Canon IXY 10s": "IXY 10s",
  "Canon IXY 30s": "IXY 30s",
  "Canon IXY 930 IS": "IXY 930 IS",
  "Canon IXY 510 IS": "IXY 510 IS",
  "Canon IXY 910 IS": "IXY 910 IS",
  "Canon IXY 200 (IXUS 185)": "IXY 200",
};
