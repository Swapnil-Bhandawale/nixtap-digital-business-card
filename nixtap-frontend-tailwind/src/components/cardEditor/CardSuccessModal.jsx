import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, ExternalLink, X } from 'lucide-react';

export default function CardSuccessModal({ publicSlug, onClose }) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/c/${publicSlug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Nixtap Digital Card',
          text: 'Check out my digital business card!',
          url: publicUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1e1e2a] rounded-[24px] shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6 mt-2">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6" strokeWidth={3} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Card Saved!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Scan this QR or share your link. <br/>This URL is ready to be written to your NFC card.
          </p>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-slate-200 shadow-sm mx-auto w-fit mb-6">
          <QRCodeSVG 
            value={publicUrl} 
            size={180}
            level="H"
            includeMargin={true}
            className="rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#f8f9fc] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[12px] p-2 mb-4">
          <div className="flex-1 overflow-hidden">
            <p className="text-[11px] text-slate-900 dark:text-slate-200 font-medium truncate px-2">
              {publicUrl}
            </p>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex-shrink-0"
            title="Copy Link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <a 
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Open Card <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
