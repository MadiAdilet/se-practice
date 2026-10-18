export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes since midnight, 0-1440
  end: number; // minutes since midnight, 0-1440
  bookedBy: string;
}

export type AvailabilityDecision =
  | { available: true }
  | { available: false; reason: string };
