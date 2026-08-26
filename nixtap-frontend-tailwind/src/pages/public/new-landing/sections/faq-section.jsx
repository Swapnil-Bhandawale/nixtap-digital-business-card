import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import SectionTitle from '../components/section-title';

export default function FaqSection() {
    const [isOpen, setIsOpen] = useState(false);
    const data = [
        {
            question: 'What is a Digital Business Card?',
            answer: "It's a modern, contactless way to share your professional identity. Instead of paper, you get a custom digital profile containing all your contact info, social links, and more.",
        },
        {
            question: 'Do my clients need an app to save my card?',
            answer: 'No! Your connections can view and save your Nixtap card using their smartphone camera or by tapping an NFC card. No app download is required to receive your details.',
        },
        {
            question: 'Does it work with both iOS and Android?',
            answer: 'Yes, Nixtap is fully compatible with all modern iOS (Apple) and Android devices. Anyone with a smartphone can connect with you instantly.',
        },
        {
            question: 'Can I update my information anytime?',
            answer: 'Absolutely! You can update your contact details, profile picture, or links anytime from your dashboard. Your card instantly reflects the new information everywhere.',
        },
        {
            question: 'How do people save my details to their phone?',
            answer: "With a single tap on the 'Save Contact' button, your complete profile is securely downloaded as a vCard (.vcf) and saved directly to their phone's native address book.",
        },
        {
            question: 'Can I have multiple digital cards?',
            answer: 'Yes! You can create different cards for different businesses, roles, or events and manage them all from a single Nixtap account.',
        },
    ];

    return (
        <section id="faqs" className='flex flex-col items-center justify-center mt-40 scroll-mt-24'>
            <SectionTitle title="FAQ's" subtitle="Looking for answers to your frequently asked questions? Check out our FAQ's section below to find." />
            <div className='mx-auto mt-12 w-full max-w-xl'>
                {data.map((item, index) => (
                    <div key={index} className='flex flex-col border-b border-gray-200 bg-white'>
                        <h3 className='flex cursor-pointer items-start justify-between gap-4 py-4 font-medium' onClick={() => setIsOpen(isOpen === index ? null : index)}>
                            {item.question}
                            {isOpen === index ? <MinusIcon className='size-5 text-gray-500' /> : <PlusIcon className='size-5 text-gray-500' />}
                        </h3>
                        <p className={`pb-4 text-sm/6 text-gray-500 ${isOpen === index ? 'block' : 'hidden'}`}>{item.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
