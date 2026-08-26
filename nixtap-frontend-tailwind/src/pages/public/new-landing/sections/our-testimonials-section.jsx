import { StarIcon } from 'lucide-react';

const data = [
    {
        review: 'Super clean and easy to use. The digital business cards saved me hours of networking time and countless paper cards!',
        name: 'Richard Nelson',
        about: 'Founder & CEO',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    },
    {
        review: 'The design quality is top-notch. Perfect balance between simplicity and style. Highly recommend for any professional!',
        name: 'Sophia Martinez',
        about: 'Creative Director',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    },
    {
        review: 'Absolutely love the wallet integration. My workflow feels 10x faster now that my card is right on my phone screen.',
        name: 'Ethan Roberts',
        about: 'Sales Manager',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: 'Clean, elegant, and efficient. Nixtap is a dream for any modern professional who values first impressions.',
        name: 'Isabella Kim',
        about: 'Marketing Lead',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: "I've tried dozens of digital card apps, but this one just feels right. Everything works seamlessly and looks incredibly polished.",
        name: 'Liam Johnson',
        about: 'Real Estate Agent',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop',
    },
    {
        review: 'Brilliantly structured with clean, modern styling. Makes networking a joy and updating contact details super quick.',
        name: 'Ava Patel',
        about: 'Startup Founder',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    },
];

const TestimonialCard = ({ item }) => (
    <div className='w-full min-w-[340px] max-w-[380px] space-y-4 rounded-2xl border border-indigo-50 bg-white/70 backdrop-blur-sm p-6 text-slate-600 shadow-[0_4px_24px_-8px_rgba(79,70,229,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_-8px_rgba(79,70,229,0.2)] mx-4'>
        <div className='flex gap-1'>
            {...Array(item.rating)
                .fill('')
                .map((_, index) => <StarIcon key={index} className='size-5 fill-amber-400 text-amber-400' />)}
        </div>
        <p className='line-clamp-3 text-[15px] leading-relaxed italic'>"{item.review}"</p>
        <div className='flex items-center gap-3 pt-3 border-t border-slate-100'>
            <img className='size-11 rounded-full object-cover ring-2 ring-indigo-100' src={item.image} alt={item.name} />
            <div>
                <p className='font-bold text-slate-800 text-[15px]'>{item.name}</p>
                <p className='text-indigo-600 font-medium text-xs'>{item.about}</p>
            </div>
        </div>
    </div>
);

const TestimonialRow = ({ items, direction = 'left' }) => {
    const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';
    return (
        <div className="flex w-max overflow-hidden mb-8 group">
            <div className={`flex w-max ${animClass} group-hover:[animation-play-state:paused]`} style={{ animationDuration: '50s' }}>
                <div className="flex shrink-0">
                    {items.map((item, i) => <TestimonialCard key={i} item={item} />)}
                </div>
                <div className="flex shrink-0" aria-hidden="true">
                    {items.map((item, i) => <TestimonialCard key={i} item={item} />)}
                </div>
                <div className="flex shrink-0" aria-hidden="true">
                    {items.map((item, i) => <TestimonialCard key={i} item={item} />)}
                </div>
            </div>
        </div>
    );
};

export default function OurTestimonialSection() {
    // Split data into two rows
    const row1 = [data[0], data[1], data[2], data[3]];
    const row2 = [data[4], data[5], data[0], data[1]];

    return (
        <section className='flex flex-col items-center justify-center mt-32 relative'>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent -z-10" />
            
            <div className="text-center mb-16 px-4">
                <h2 className="text-sm uppercase font-bold tracking-[0.15em] text-indigo-600 mb-3">Our Testimonials</h2>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                    Loved by professionals worldwide
                </h1>
                <p className="text-slate-500 text-[16px] max-w-xl mx-auto">
                    Hear from our satisfied customers about how Nixtap transformed their networking experience.
                </p>
            </div>

            <div className="w-full overflow-hidden relative pb-8">
                {/* Fade masks for testimonials */}
                <div className="absolute top-0 left-0 bottom-0 w-24 md:w-56 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 bottom-0 w-24 md:w-56 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                
                <TestimonialRow items={row1} direction="right" />
                <TestimonialRow items={row2} direction="left" />
            </div>
        </section>
    );
}
