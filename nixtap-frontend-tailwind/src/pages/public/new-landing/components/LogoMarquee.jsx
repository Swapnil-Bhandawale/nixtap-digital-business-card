import React from 'react';

const row1 = [
  { name: 'Figma', domain: 'figma.com' },
  { name: 'Google', domain: 'google.com' },
  { name: 'Adobe', domain: 'adobe.com' },
  { name: 'ATLASSIAN', domain: 'atlassian.com' },
  { name: 'Canva', domain: 'canva.com' },
  { name: 'duolingo', domain: 'duolingo.com' },
];

const row2 = [
  { name: 'amazon', domain: 'amazon.com' },
  { name: 'HubSpot', domain: 'hubspot.com' },
  { name: 'salesforce', domain: 'salesforce.com' },
  { name: 'slack', domain: 'slack.com' },
  { name: 'airbnb', domain: 'airbnb.com' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Dropbox', domain: 'dropbox.com' },
];

const row3 = [
  { name: 'Shopify', domain: 'shopify.com' },
  { name: 'Spotify', domain: 'spotify.com' },
  { name: 'Notion', domain: 'notion.so' },
  { name: 'stripe', domain: 'stripe.com' },
  { name: 'Asana', domain: 'asana.com' },
  { name: 'Netflix', domain: 'netflix.com' },
];

const Pill = ({ item }) => {
  const isSpecial = item.name === 'airbnb';
  const pillClasses = isSpecial 
    ? "flex items-center gap-3.5 px-6 py-3 bg-white rounded-[20px] shadow-[0_0_15px_-3px_rgba(239,68,68,0.25)] border border-red-200 min-w-max mx-3 hover:-translate-y-1 hover:shadow-[0_4px_20px_-2px_rgba(239,68,68,0.3)] transition-all duration-300 cursor-default"
    : "flex items-center gap-3.5 px-6 py-3 bg-white rounded-[20px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-slate-100 min-w-max mx-3 hover:-translate-y-1 hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-default";

  return (
    <div className={pillClasses}>
      <div className="w-[34px] h-[34px] flex items-center justify-center overflow-hidden shrink-0">
        <img 
          src={`https://icon.horse/icon/${item.domain}`} 
          alt={item.name} 
          className="w-full h-full object-contain"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
      <span className="font-bold tracking-tight text-[16px] text-slate-800">
        {item.name}
      </span>
    </div>
  );
};

const MarqueeRow = ({ items, direction = 'left' }) => {
  const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';
  return (
    <div className="flex w-max overflow-hidden mb-6 group">
      <div className={`flex w-max ${animClass} group-hover:[animation-play-state:paused]`}>
        <div className="flex shrink-0">
          {items.map((item, i) => <Pill key={i} item={item} />)}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {items.map((item, i) => <Pill key={i} item={item} />)}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {items.map((item, i) => <Pill key={i} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default function LogoMarquee() {
  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden relative pt-10 pb-24">
      <div className="absolute top-0 left-0 bottom-0 w-32 md:w-56 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-32 md:w-56 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />
      
      <MarqueeRow items={row1} direction="right" />
      <MarqueeRow items={row2} direction="left" />
      <MarqueeRow items={row3} direction="right" />
    </div>
  );
}
