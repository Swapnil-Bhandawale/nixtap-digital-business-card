import { AnimatePresence, motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCircle2, Share2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function ShareDialog({
  open = false,
  card = null,
  onClose = () => {},
}) {
  const [copied, setCopied] = useState(false);
  const PUBLIC_CARD_BASE = 'https://nixtap.com/c/';

  if (!card) return null;

  const url = `${PUBLIC_CARD_BASE}${card.customSlug || card.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Could not copy link', e);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-[#1e1e2a] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Share your card</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Scan or copy the link below</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 flex justify-center mb-5 border border-slate-100 shadow-sm">
              <QRCodeSVG
                value={url}
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            </div>

            <div className="bg-[#f8f9fc] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[10px] p-2 flex items-center gap-2 mb-6">
              <div className="flex-1 min-w-0 text-xs text-slate-600 dark:text-slate-300 truncate pl-2">
                {url}
              </div>
              <button
                onClick={handleCopy}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-white/10 shadow-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full py-2.5 transition-colors"
              >
                Close
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-violet-600 hover:opacity-90 rounded-full py-2.5 transition-all inline-flex items-center justify-center gap-1.5"
              >
                Open link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
