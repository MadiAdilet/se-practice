import type { Booking, Room } from './types';

export const ROOMS: Room[] = [
  { id: 'r1', name: 'Aurora Hall', building: 'North Wing', capacity: 40, blocked: false },
  { id: 'r2', name: 'Beacon Room', building: 'Central', capacity: 24, blocked: false },
  { id: 'r3', name: 'Cedar Studio', building: 'East Block', capacity: 12, blocked: true },
  { id: 'r4', name: 'Delta Lab', building: 'South Wing', capacity: 30, blocked: false },
  { id: 'r5', name: 'Echo Lounge', building: 'Central', capacity: 8, blocked: false },
];

export const INITIAL_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'Dr. Reyes' },   // 09:00-10:00
  { id: 'b2', roomId: 'r1', start: 720, end: 780, bookedBy: 'Student Council' }, // 12:00-13:00
  { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'Prof. Lin' },   // 10:00-11:00
  { id: 'b4', roomId: 'r4', start: 480, end: 540, bookedBy: 'Robotics Club' }, // 08:00-09:00
  { id: 'b5', roomId: 'r5', start: 840, end: 900, bookedBy: 'Study Group A' }, // 14:00-15:00
];
