import { useState, useEffect } from 'react';

export default function TimeInput({ value, onChange, placeholderHr = '12', placeholderMin = '00' }) {
  // Parse incoming value "HH:MM"
  const parseValue = (val) => {
    if (!val) return { h: '', m: '', ap: 'AM' };
    const [hStr, mStr] = val.split(':');
    let h24 = parseInt(hStr, 10);
    if (isNaN(h24)) return { h: '', m: '', ap: 'AM' };
    let ap = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12 || 12;
    return { 
      h: String(h12).padStart(2, '0'), 
      m: (mStr || '00').padStart(2, '0'), 
      ap 
    };
  };

  const parsed = parseValue(value);
  const [hour, setHour] = useState(parsed.h);
  const [minute, setMinute] = useState(parsed.m);
  const [ampm, setAmPm] = useState(parsed.ap);

  // Sync state if value prop changes externally
  useEffect(() => {
    const p = parseValue(value);
    setHour(p.h);
    setMinute(p.m);
    setAmPm(p.ap);
  }, [value]);

  const updateParent = (h, m, ap) => {
    if (!h || !m) {
      onChange(''); // invalid time
      return;
    }
    let h24 = parseInt(h, 10);
    if (ap === 'PM' && h24 !== 12) h24 += 12;
    if (ap === 'AM' && h24 === 12) h24 = 0;
    const hhStr = String(h24).padStart(2, '0');
    onChange(`${hhStr}:${m}`);
  };

  const handleHourBlur = () => {
    if (!hour) return;
    let h = parseInt(hour, 10);
    if (isNaN(h) || h < 1) h = 1;
    if (h > 12) h = 12;
    const formatted = String(h).padStart(2, '0');
    setHour(formatted);
    updateParent(formatted, minute, ampm);
  };

  const handleMinuteBlur = () => {
    if (!minute) return;
    let m = parseInt(minute, 10);
    if (isNaN(m) || m < 0) m = 0;
    if (m > 59) m = 59;
    const formatted = String(m).padStart(2, '0');
    setMinute(formatted);
    updateParent(hour, formatted, ampm);
  };

  return (
    <div className="flex items-center gap-1 bg-white border-2 border-ink-tertiary/30 rounded-xl px-3 py-2 shadow-sm focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all w-fit min-h-[44px]">
      <input 
        type="text" 
        maxLength={2} 
        placeholder={placeholderHr}
        value={hour}
        aria-label="Hour"
        onChange={e => {
          setHour(e.target.value.replace(/\D/g, ''));
        }}
        onBlur={handleHourBlur}
        className="w-12 text-center text-lg font-bold text-ink-primary outline-none bg-transparent placeholder-ink-tertiary/50" 
      />
      <span className="text-xl font-bold text-ink-tertiary/50 pb-1" aria-hidden="true">:</span>
      <input 
        type="text" 
        maxLength={2} 
        placeholder={placeholderMin}
        value={minute}
        aria-label="Minute"
        onChange={e => {
          setMinute(e.target.value.replace(/\D/g, ''));
        }}
        onBlur={handleMinuteBlur}
        className="w-12 text-center text-lg font-bold text-ink-primary outline-none bg-transparent placeholder-ink-tertiary/50" 
      />
      <div className="relative ml-2">
        <select 
          value={ampm}
          aria-label="AM or PM"
          onChange={e => {
            setAmPm(e.target.value);
            updateParent(hour, minute, e.target.value);
          }}
          className="appearance-none bg-surface-2 text-ink-primary font-black text-sm pl-3 pr-8 py-2 rounded-lg outline-none cursor-pointer hover:bg-surface-border transition-colors border-none min-h-[36px]"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-ink-tertiary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
