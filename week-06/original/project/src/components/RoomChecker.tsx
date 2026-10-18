import { useMemo, useState } from 'react';
import { Clock, DoorClosed, CheckCircle2, XCircle, CalendarClock, MapPin, Users, Ban } from 'lucide-react';
import { ROOMS, INITIAL_BOOKINGS } from '@/lib/sampleData';
import { checkAvailability, fmt } from '@/lib/availability';
import type { AvailabilityDecision } from '@/lib/types';

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function nowToMinutes(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export default function RoomChecker() {
  const bookings = INITIAL_BOOKINGS; // AC5: never mutate booking data
  const now = useMemo(() => new Date(), []);
  const nowMin = nowToMinutes(now);
  const nowLabel = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [startTime, setStartTime] = useState<string>(nowLabel);
  const [endTime, setEndTime] = useState<string>(
    `${pad(Math.min(23, now.getHours() + 1))}:${pad(now.getMinutes())}`
  );
  const [submitted, setSubmitted] = useState(false);

  const room = ROOMS.find((r) => r.id === roomId);
  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);

  const decision: AvailabilityDecision = checkAvailability(
    room,
    startMin,
    endMin,
    nowMin,
    bookings
  );

  const roomBookings = bookings.filter((b) => b.roomId === roomId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setStartTime(nowLabel);
    setEndTime(`${pad(Math.min(23, now.getHours() + 1))}:${pad(now.getMinutes())}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Smart Campus Room Availability</h1>
              <p className="text-sm text-slate-500">Check whether a room is free for your time slot. No booking is created.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <section className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <DoorClosed className="w-5 h-5 text-emerald-600" />
            Check a room
          </h2>
          <p className="text-sm text-slate-500 mb-5">Bookings are limited to 120 minutes. Current time: {nowLabel}.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="room" className="block text-sm font-medium mb-1.5">
                Room
              </label>
              <select
                id="room"
                value={roomId}
                onChange={(e) => { setRoomId(e.target.value); setSubmitted(false); }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {ROOMS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.building} (cap {r.capacity}){r.blocked ? ' · BLOCKED' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start" className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Start time
                </label>
                <input
                  id="start"
                  type="time"
                  value={startTime}
                  onChange={(e) => { setStartTime(e.target.value); setSubmitted(false); }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="end" className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> End time
                </label>
                <input
                  id="end"
                  type="time"
                  value={endTime}
                  onChange={(e) => { setEndTime(e.target.value); setSubmitted(false); }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 active:bg-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Check availability
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Decision (AC5) */}
          {submitted && (
            <div
              role="status"
              className={`mt-6 rounded-xl border p-4 flex items-start gap-3 ${
                decision.available
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-rose-200 bg-rose-50 text-rose-900'
              }`}
            >
              {decision.available ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-rose-600" />
              )}
              <div>
                <p className="font-semibold">
                  {decision.available ? 'Available' : 'Unavailable'}
                </p>
                <p className="text-sm mt-0.5">
                  {decision.available
                    ? `${room?.name ?? 'This room'} is free from ${fmt(startMin)} to ${fmt(endMin)}.`
                    : decision.reason}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Room info + schedule */}
        <aside className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold mb-3">Room details</h2>
            {room && (
              <dl className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <dt className="text-slate-500">Building:</dt>
                  <dd className="font-medium">{room.building}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <dt className="text-slate-500">Capacity:</dt>
                  <dd className="font-medium">{room.capacity} people</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4 text-slate-400" />
                  <dt className="text-slate-500">Status:</dt>
                  <dd className={`font-medium ${room.blocked ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {room.blocked ? 'Blocked' : 'Open'}
                  </dd>
                </div>
              </dl>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold mb-1">Existing bookings</h2>
            <p className="text-xs text-slate-500 mb-3">For {room?.name}. Touching endpoints are allowed.</p>
            {roomBookings.length === 0 ? (
              <p className="text-sm text-slate-500">No existing bookings for this room.</p>
            ) : (
              <ul className="space-y-2">
                {roomBookings
                  .slice()
                  .sort((a, b) => a.start - b.start)
                  .map((b) => (
                    <li
                      key={b.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium tabular-nums">{fmt(b.start)}–{fmt(b.end)}</span>
                      <span className="text-slate-500">{b.bookedBy}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </aside>
      </main>

      <footer className="max-w-5xl mx-auto px-4 pb-8 text-xs text-slate-400">
        Fictional sample data only. No booking data is modified when checking availability.
      </footer>
    </div>
  );
}
