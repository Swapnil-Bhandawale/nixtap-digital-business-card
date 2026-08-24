export default function CardSelector({ cards = [], value = null, onChange = () => {} }) {
  if (!cards || cards.length <= 1) return null;

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-white dark:bg-white/5 border border-black/[0.08] dark:border-white/10 rounded-full pl-4 pr-9 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors cursor-pointer"
    >
      {cards.map((c) => (
        <option key={c.id} value={c.id} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
          {c.fullName}
        </option>
      ))}
    </select>
  );
}
