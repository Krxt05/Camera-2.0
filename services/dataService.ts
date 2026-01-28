import { Booking, SHEET_URL } from '../types';

// Helper to parse DD/MM/YYYY
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;
  // Note: Month is 0-indexed in JS Date
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
};

export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    const rows = csvText.split('\n').slice(1); // Skip header
    const bookings: Booking[] = [];

    rows.forEach(row => {
      // Handle CSV parsing loosely (simple split by comma)
      // For more robust parsing, libraries like PapaParse are usually used, 
      // but simple split works for standard Google Sheet CSV exports usually.
      // We need to handle potential quotes if descriptions have commas, but 
      // based on the structure (Model, Start, End), simple split is likely safe enough for this demo.
      const cols = row.split(',');
      if (cols.length >= 3) {
        const model = cols[0].trim();
        const start = parseDate(cols[1]);
        const end = parseDate(cols[2]);

        if (model && start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
          bookings.push({ model, start, end });
        }
      }
    });

    return bookings;
  } catch (error) {
    console.error("Failed to fetch bookings", error);
    return [];
  }
};