import React, { useEffect, useMemo, useState } from 'react';
import { ADMIN_API_URL, CAMERA_FULL_NAMES } from '../types';
import { Trash2, Plus } from 'lucide-react';
import BookingHeatmap from './BookingHeatmap';

interface BookingRow {
  rowIndex: number;
  model: string;
  start: string;
  end: string;
}

// Convert <input type="date"> value ("YYYY-MM-DD") to the sheet's "D/M/YYYY" format
const toSheetDate = (isoDate: string): string => {
  const [y, m, d] = isoDate.split('-');
  return `${parseInt(d, 10)}/${parseInt(m, 10)}/${y}`;
};

// The sheet stores dates as real Date cells, so the API returns ISO strings; format for display
const formatDisplayDate = (value: string): string => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' });
};

const callApi = async (body: Record<string, unknown>) => {
  const res = await fetch(ADMIN_API_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.json();
};

const AdminQueue: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [model, setModel] = useState(CAMERA_FULL_NAMES[0]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const [filterModel, setFilterModel] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState<'start_desc' | 'start_asc' | 'model'>('start_desc');

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await callApi({ action: 'listBookings' });
      if (data.error) {
        setError(data.error);
      } else {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      setError('เชื่อมต่อไม่ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) return;
    setLoading(true);
    setError('');
    try {
      const data = await callApi({
        action: 'addBooking',
        model,
        start: toSheetDate(start),
        end: toSheetDate(end),
      });
      if (data.error) {
        setError(data.error);
      } else {
        setStart('');
        setEnd('');
        await loadBookings();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rowIndex: number) => {
    setLoading(true);
    try {
      await callApi({ action: 'deleteBooking', rowIndex });
      await loadBookings();
    } finally {
      setLoading(false);
    }
  };

  const visibleBookings = useMemo(() => {
    let list = bookings;
    if (filterModel !== 'ทั้งหมด') {
      list = list.filter((b) => b.model === filterModel);
    }
    list = [...list];
    if (sortBy === 'start_desc') {
      list.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
    } else if (sortBy === 'start_asc') {
      list.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    } else {
      list.sort((a, b) => a.model.localeCompare(b.model) || new Date(a.start).getTime() - new Date(b.start).getTime());
    }
    return list;
  }, [bookings, filterModel, sortBy]);

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-gray-700">คิวการจอง (Admin)</h1>

        <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
          <h2 className="font-semibold text-gray-600 text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> เพิ่มคิว
          </h2>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm"
          >
            {CAMERA_FULL_NAMES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="flex-1 border border-pink-200 rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="flex-1 border border-pink-200 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-400 text-white rounded-lg py-2 font-medium hover:bg-pink-500 disabled:opacity-50"
          >
            เพิ่มคิว
          </button>
        </form>

        <BookingHeatmap bookings={bookings} />

        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <h2 className="font-semibold text-gray-600 text-sm">คิวทั้งหมด ({visibleBookings.length})</h2>
            <div className="flex items-center gap-2">
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="border border-pink-200 rounded-lg px-2 py-1 text-xs text-gray-600"
              >
                <option value="ทั้งหมด">ทุกรุ่น</option>
                {CAMERA_FULL_NAMES.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-pink-200 rounded-lg px-2 py-1 text-xs text-gray-600"
              >
                <option value="start_desc">วันที่รับ ใหม่→เก่า</option>
                <option value="start_asc">วันที่รับ เก่า→ใหม่</option>
                <option value="model">เรียงตามรุ่น</option>
              </select>
            </div>
          </div>
          {loading && <p className="text-sm text-gray-400">กำลังโหลด...</p>}
          <div className="space-y-2">
            {visibleBookings.map((b) => (
              <div key={b.rowIndex} className="flex items-center justify-between border-b border-pink-50 pb-2 text-sm">
                <div>
                  <p className="font-medium text-gray-700">{b.model}</p>
                  <p className="text-gray-400">{formatDisplayDate(b.start)} - {formatDisplayDate(b.end)}</p>
                </div>
                <button onClick={() => handleDelete(b.rowIndex)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {!loading && visibleBookings.length === 0 && (
              <p className="text-sm text-gray-400">ยังไม่มีคิว</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQueue;
