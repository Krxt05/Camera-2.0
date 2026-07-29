import React, { useMemo, useState } from 'react';
import { CAMERA_FULL_NAMES, CAMERA_SHORT_NAMES } from '../types';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingRow {
  rowIndex: number;
  model: string;
  start: string;
  end: string;
}

interface Props {
  bookings: BookingRow[];
}

// The sheet stores dates as real Date cells (UTC ISO from the API); read the
// calendar day back out in the shop's own timezone so it lines up with what
// was typed into the date picker.
const bangkokKey = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const dayKey = (y: number, m: number, d: number): string =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

interface Tooltip {
  x: number;
  y: number;
  lines: string[];
}

// Blue/orange — the most CVD-distinguishable pair, used here as an identity pair
// (pickup vs return event) rather than for magnitude.
const PICKUP_COLOR = '#2a78d6'; // รับกล้อง (camera leaves the shop)
const RETURN_COLOR = '#eb6834'; // คืนกล้อง (camera comes back)

const BookingHeatmap: React.FC<Props> = ({ bookings }) => {
  const [month, setMonth] = useState(new Date());
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = useMemo(() => eachDayOfInterval({ start: monthStart, end: monthEnd }), [month]);
  const todayKey = bangkokKey(new Date());

  // Pre-index bookings per model → set of booked day-keys, plus start/end keys
  const byModel = useMemo(() => {
    const map: Record<string, { busy: Set<string>; starts: Map<string, string>; ends: Map<string, string> }> = {};
    for (const name of CAMERA_FULL_NAMES) {
      map[name] = { busy: new Set(), starts: new Map(), ends: new Map() };
    }
    for (const b of bookings) {
      const entry = map[b.model];
      if (!entry || !b.start || !b.end) continue;
      if (isNaN(new Date(b.start).getTime()) || isNaN(new Date(b.end).getTime())) continue;
      const startKey = bangkokKey(b.start);
      const endKey = bangkokKey(b.end);
      entry.starts.set(startKey, b.end);
      entry.ends.set(endKey, b.start);
      // walk day by day (bounded: bookings are short rentals, never more than ~2 months)
      let cursor = new Date(b.start);
      for (let i = 0; i < 60; i++) {
        const key = bangkokKey(cursor);
        entry.busy.add(key);
        if (key >= endKey) break;
        cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
      }
    }
    return map;
  }, [bookings]);

  const showTooltip = (e: React.SyntheticEvent, lines: string[]) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top, lines });
  };
  const hideTooltip = () => setTooltip(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3 relative">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-600 text-sm">ภาพรวมความว่าง (ทุกรุ่น)</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setMonth(subMonths(month, 1))} className="p-1 hover:bg-pink-50 rounded-full text-pink-500">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-medium text-gray-500 w-20 text-center">{format(month, 'MMM yyyy')}</span>
          <button onClick={() => setMonth(addMonths(month, 1))} className="p-1 hover:bg-pink-50 rounded-full text-pink-500">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: days.length * 24 + 88 }}>
          {/* day-of-month header */}
          <div className="flex">
            <div className="w-20 flex-shrink-0" />
            {days.map((d) => (
              <div
                key={d.toISOString()}
                className={`w-6 flex-shrink-0 text-center text-[10px] ${bangkokKey(d) === todayKey ? 'text-pink-500 font-bold' : 'text-gray-400'}`}
              >
                {format(d, 'd')}
              </div>
            ))}
          </div>

          {CAMERA_FULL_NAMES.map((name) => {
            const entry = byModel[name];
            return (
              <div key={name} className="flex items-center h-7">
                <div className="w-20 flex-shrink-0 text-xs text-gray-600 font-medium truncate pr-1">
                  {CAMERA_SHORT_NAMES[name]}
                </div>
                {days.map((d) => {
                  const key = bangkokKey(d);
                  const isToday = key === todayKey;
                  const isBusy = entry.busy.has(key);
                  const isStart = entry.starts.has(key);
                  const isEnd = entry.ends.has(key);

                  let cellClass = 'w-6 h-6 flex-shrink-0 border-t border-b border-white ';
                  let cellStyle: React.CSSProperties | undefined;
                  if (isStart && isEnd) {
                    // same day: one booking returns and another (or the same) picks up — split the cell
                    cellClass += 'rounded-md ';
                    cellStyle = { background: `linear-gradient(to right, ${RETURN_COLOR} 50%, ${PICKUP_COLOR} 50%)` };
                  } else if (isStart) {
                    cellClass += 'rounded-l-md ';
                    cellStyle = { background: PICKUP_COLOR };
                  } else if (isEnd) {
                    cellClass += 'rounded-r-md ';
                    cellStyle = { background: RETURN_COLOR };
                  } else if (isBusy) {
                    cellClass += 'bg-red-200 ';
                  } else {
                    cellClass += 'bg-green-50 ';
                  }
                  if (isToday) cellClass += 'ring-2 ring-pink-400 ring-inset z-10 ';

                  const lines = [
                    `${CAMERA_SHORT_NAMES[name]} — ${format(d, 'd MMM yyyy')}`,
                    isBusy ? 'ไม่ว่าง' : 'ว่าง',
                  ];
                  if (isEnd) lines.push('คืนกล้องวันนี้');
                  if (isStart) lines.push('รับกล้องวันนี้');

                  return (
                    <button
                      key={key}
                      type="button"
                      className={cellClass}
                      style={cellStyle}
                      onMouseEnter={(e) => showTooltip(e, lines)}
                      onFocus={(e) => showTooltip(e, lines)}
                      onMouseLeave={hideTooltip}
                      onBlur={hideTooltip}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap text-[11px] text-gray-500 pt-1 border-t border-gray-100">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-50 border border-gray-200" />ว่าง</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200" />ไม่ว่าง</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: PICKUP_COLOR }} />รับกล้อง</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: RETURN_COLOR }} />คืนกล้อง</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: `linear-gradient(to right, ${RETURN_COLOR} 50%, ${PICKUP_COLOR} 50%)` }} />คืน+รับวันเดียวกัน</span>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-[11px] rounded-lg px-2 py-1.5 pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 6 }}
        >
          {tooltip.lines.map((line, i) => (
            <div key={i} className={i === 0 ? 'font-semibold' : ''}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHeatmap;
