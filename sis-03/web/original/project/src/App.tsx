import { useState } from 'react';

type Room = {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
};

type CheckResult = {
  status: 'Available' | 'Unavailable';
  message: string;
};

const NOW_MINUTES = 540;
const EXISTING_BOOKING = { start: 600, end: 660 };

const rooms: Room[] = [
  { id: 'b204', name: 'Room B204', building: 'Science Building', capacity: 24, blocked: false },
  { id: 'a118', name: 'Room A118', building: 'Arts Building', capacity: 18, blocked: false },
  { id: 'c301', name: 'Room C301', building: 'Library Annex', capacity: 32, blocked: true },
];

function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function App() {
  const [roomId, setRoomId] = useState('b204');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [result, setResult] = useState<CheckResult>({
    status: 'Available',
    message: 'This room is open for your selected time.',
  });
  const [hasChecked, setHasChecked] = useState(true);

  const selectedRoom = rooms.find((room) => room.id === roomId) ?? rooms[0];

  function checkAvailability(): void {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    setHasChecked(true);

    if (!startTime || !endTime || Number.isNaN(start) || Number.isNaN(end)) {
      setResult({ status: 'Unavailable', message: 'Enter both a start time and an end time.' });
      return;
    }

    if (start < 0 || end > 1440 || start >= end) {
      setResult({ status: 'Unavailable', message: 'Choose a valid time range where the start comes before the end.' });
      return;
    }

    if (start <= NOW_MINUTES) {
      setResult({ status: 'Unavailable', message: 'Start time must be after the current time, 9:00 AM.' });
      return;
    }

    if (end - start > 120) {
      setResult({ status: 'Unavailable', message: 'Bookings can be no longer than 2 hours.' });
      return;
    }

    if (selectedRoom.blocked) {
      setResult({ status: 'Unavailable', message: 'This room is currently blocked and cannot be booked.' });
      return;
    }

    const overlaps = start < EXISTING_BOOKING.end && end > EXISTING_BOOKING.start;
    if (overlaps) {
      setResult({ status: 'Unavailable', message: 'This time overlaps an existing booking from 10:00–11:00 AM.' });
      return;
    }

    setResult({ status: 'Available', message: 'This room is open for your selected time.' });
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#13233f]">
      <header className="border-b border-[#e5ebf1] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e7c7b] text-lg font-bold text-white shadow-sm">SC</div>
            <div>
              <p className="text-sm font-bold tracking-tight text-[#13233f]">Smart Campus</p>
              <p className="text-xs text-[#718096]">Space finder</p>
            </div>
          </div>
          <div className="hidden items-center gap-7 text-sm font-medium text-[#607087] sm:flex">
            <span className="border-b-2 border-[#0e7c7b] pb-1 text-[#13233f]">Check a room</span>
            <span>Building directory</span>
            <span>Help</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#f2f7f8] px-3 py-2 text-xs font-semibold text-[#167372] sm:hidden">
            <span className="h-2 w-2 rounded-full bg-[#29a36a]" /> Open now
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0e7c7b]">
              <span className="h-px w-7 bg-[#0e7c7b]" /> Room availability
            </div>
            <h1 className="text-4xl font-bold tracking-[-0.04em] text-[#13233f] sm:text-5xl">Check a room</h1>
            <p className="mt-3 max-w-lg text-base leading-7 text-[#607087]">Find a quiet place to study, meet, or make your next idea happen.</p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-2xl border border-[#dce8ea] bg-white px-4 py-3 shadow-sm sm:self-end">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5f5f2] text-[#0e7c7b]">
              <span className="h-3 w-3 rounded-full border-2 border-[#0e7c7b]" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b99aa]">Current time</p>
              <p className="text-lg font-bold text-[#13233f]">09:00 AM</p>
            </div>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-[#e1e9ef] bg-white p-6 shadow-[0_12px_40px_rgba(19,35,63,0.06)] sm:p-9">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#13233f]">Find an available space</h2>
                <p className="mt-2 text-sm leading-6 text-[#718096]">Select a room and a time window to see what is open.</p>
              </div>
              <div className="hidden rounded-full bg-[#eef8f6] px-3 py-1.5 text-xs font-bold text-[#197c70] sm:block">Live schedule</div>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#26364e]">Select a room</span>
                <span className="relative block">
                  <select value={roomId} onChange={(event) => setRoomId(event.target.value)} className="w-full appearance-none rounded-xl border border-[#ced9e2] bg-white px-4 py-3.5 pr-11 text-base font-medium text-[#26364e] outline-none transition focus:border-[#0e7c7b] focus:ring-4 focus:ring-[#0e7c7b]/10">
                    {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}{room.blocked ? ' — Blocked' : ''}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#718096]">⌄</span>
                </span>
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#26364e]">Start time</span>
                  <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="w-full rounded-xl border border-[#ced9e2] bg-white px-4 py-3.5 text-base font-medium text-[#26364e] outline-none transition focus:border-[#0e7c7b] focus:ring-4 focus:ring-[#0e7c7b]/10" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#26364e]">End time</span>
                  <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="w-full rounded-xl border border-[#ced9e2] bg-white px-4 py-3.5 text-base font-medium text-[#26364e] outline-none transition focus:border-[#0e7c7b] focus:ring-4 focus:ring-[#0e7c7b]/10" />
                </label>
              </div>

              <button type="button" onClick={checkAvailability} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0e7c7b] px-5 py-4 text-base font-bold text-white shadow-[0_8px_18px_rgba(14,124,123,0.2)] transition hover:-translate-y-0.5 hover:bg-[#096766] hover:shadow-[0_12px_24px_rgba(14,124,123,0.25)] focus:outline-none focus:ring-4 focus:ring-[#0e7c7b]/25 active:translate-y-0">
                Check availability <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </section>

          <aside className="space-y-7">
            {hasChecked && (
              <div className={`rounded-3xl border p-6 shadow-sm ${result.status === 'Available' ? 'border-[#9bd5b8] bg-[#effaf3]' : 'border-[#efb3ad] bg-[#fff5f3]'}`} role="status" aria-live="polite">
                <div className="flex gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${result.status === 'Available' ? 'bg-[#2b9d69]' : 'bg-[#d55d54]'}`}>
                    {result.status === 'Available' ? '✓' : '!'}
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${result.status === 'Available' ? 'text-[#17643e]' : 'text-[#9e3e37]'}`}>{result.status}</p>
                    <p className={`mt-1 text-sm leading-6 ${result.status === 'Available' ? 'text-[#3a7656]' : 'text-[#9e514b]'}`}>{result.message}</p>
                  </div>
                </div>
                {result.status === 'Available' && <div className="mt-5 border-t border-[#bfe5cb] pt-4 text-sm font-semibold text-[#17643e]">{selectedRoom.name} · {formatTime(startTime)}–{formatTime(endTime)}</div>}
              </div>
            )}

            <div className="rounded-3xl border border-[#e1e9ef] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e7c7b]">Today</p>
                  <h2 className="mt-1 text-lg font-bold text-[#13233f]">Schedule snapshot</h2>
                </div>
                <span className="rounded-lg bg-[#f3f6f8] px-2.5 py-1 text-xs font-semibold text-[#718096]">{selectedRoom.name.replace('Room ', '')}</span>
              </div>
              <div className="relative pt-3">
                <div className="mb-3 flex justify-between text-[11px] font-semibold text-[#8b99aa]"><span>9 AM</span><span>11 AM</span><span>1 PM</span></div>
                <div className="relative h-16 rounded-xl border border-[#e5ebf1] bg-[#fbfcfd]">
                  <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#dce4eb]" />
                  <div className="absolute left-0 top-3 h-10 w-1/2 rounded-l-lg border-y border-l border-[#b7c2ce] bg-[#dfe6ed] px-3 py-2 text-xs font-bold text-[#3f5065] sm:text-sm">10:00–11:00 AM</div>
                </div>
                <p className="mt-3 text-xs leading-5 text-[#8b99aa]">One existing booking is shown. Touching the 11:00 AM endpoint is permitted.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#13233f] p-5 text-white">
              <span className="mt-0.5 text-[#65d2c2]">i</span>
              <p className="text-sm leading-6 text-[#dce6f0]">Bookings are limited to 2 hours and must begin after 9:00 AM.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
