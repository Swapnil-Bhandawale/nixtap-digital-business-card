import { motion } from 'framer-motion';
import { Eye, Users, Pencil, Share2, Trash2 } from 'lucide-react';

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)';

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NX';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

function MiniPhonePreview({ gradient, initials, avatarUrl }) {
  return (
    <div className="w-14 h-24 rounded-xl bg-white dark:bg-[#141420] border border-black/[0.08] dark:border-white/10 flex-shrink-0 flex flex-col items-center pt-2 gap-1.5 overflow-hidden">
      <div className="w-5 h-1.5 rounded-full" style={{ background: gradient }} />
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-white/20" />
      ) : (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
          style={{ background: gradient }}
        >
          {initials}
        </div>
      )}
      <div className="w-8 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mt-0.5" />
      <div className="w-6 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="flex gap-1 mt-1">
        <div className="w-2 h-2 rounded-full bg-slate-100 dark:bg-white/10" />
        <div className="w-2 h-2 rounded-full bg-slate-100 dark:bg-white/10" />
        <div className="w-2 h-2 rounded-full bg-slate-100 dark:bg-white/10" />
      </div>
    </div>
  );
}

export default function CardTile({
  card,
  index = 0,
  onEdit = () => {},
  onShare = () => {},
  onDelete = () => {},
}) {
  const { fullName, jobTitle, customSlug, theme, views = 0, leads = 0, profileImageUrl } = card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-[#1e1e2a] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:shadow-xl dark:shadow-none transition-shadow duration-300 p-4"
    >
      <div className="flex gap-3">
        <MiniPhonePreview gradient={theme || DEFAULT_GRADIENT} initials={initialsOf(fullName)} avatarUrl={profileImageUrl} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 truncate">{fullName}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{jobTitle}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 truncate">nixtap.com/c/{customSlug || card.id}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {views.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {leads.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/[0.05] dark:border-white/[0.06]">
        <button
          onClick={() => onEdit(card)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full py-2 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={() => onShare(card)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-full py-2 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
        <button
          onClick={() => onDelete(card)}
          aria-label={`Delete ${fullName}`}
          className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export function CardTileSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1e1e2a] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-14 h-24 rounded-xl bg-slate-100 dark:bg-white/5 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-3.5 w-24 bg-slate-100 dark:bg-white/5 rounded-full" />
          <div className="h-2.5 w-32 bg-slate-100 dark:bg-white/5 rounded-full mt-2.5" />
          <div className="h-2.5 w-28 bg-slate-100 dark:bg-white/5 rounded-full mt-3" />
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-black/[0.05] dark:border-white/[0.06]">
        <div className="h-8 flex-1 bg-slate-100 dark:bg-white/5 rounded-full" />
        <div className="h-8 flex-1 bg-slate-100 dark:bg-white/5 rounded-full" />
        <div className="h-8 w-8 bg-slate-100 dark:bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

