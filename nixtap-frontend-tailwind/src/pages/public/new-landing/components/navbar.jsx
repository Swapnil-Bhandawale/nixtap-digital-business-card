import { MenuIcon, XIcon, ChevronDown, FileTextIcon, ImageUpIcon, FileVideo, AudioLines, LightbulbIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const links = [
        { name: 'Home', href: '/' },
        {
            name: 'Features',
            subLinks: [
                { name: 'Digital Cards', href: '/#features', icon: FileTextIcon, description: 'Create stunning profiles' },
                { name: 'QR Code Sharing', href: '/#features', icon: ImageUpIcon, description: 'Share instantly via QR' },
                { name: 'Analytics', href: '/#analytics', icon: FileVideo, description: 'Track your card engagement' },
                { name: 'Lead Generation', href: '/#features', icon: AudioLines, description: 'Capture contact info' },
            ],
        },
        { name: 'Templates', href: '/#templates' },
        { name: 'Pricing', href: '/#pricing' },
    ];

    return (
        <>
            <nav className='sticky top-0 z-50 flex w-full items-center justify-between bg-white/50 px-4 py-3.5 backdrop-blur-md md:px-16 lg:px-24'>
                <Link to='/' className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                        N
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Nixtap
                    </span>
                </Link>

                <div className='hidden items-center space-x-7 text-gray-700 md:flex'>
                    {links.map((link) => link.subLinks ? (
                        <div key={link.name} className='group relative' onMouseEnter={() => setOpenDropdown(link.name)} onMouseLeave={() => setOpenDropdown(null)}>
                            <div className='flex cursor-pointer items-center gap-1 hover:text-black'>
                                {link.name}
                                <ChevronDown className={`mt-px size-4 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                            </div>

                            <div className={`absolute top-6 left-0 z-40 w-lg rounded-md border border-gray-100 bg-white p-3 shadow-lg transition-all duration-200 ease-in-out ${openDropdown === link.name ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
                                <p>Explore our AI tools</p>
                                <div className='mt-3 grid grid-cols-2 gap-2'>
                                    {link.subLinks.map((sub) => (
                                        <Link to={sub.href} key={sub.name} className='group/link flex items-center gap-2 rounded-md p-2 transition hover:bg-gray-100'>
                                            <div className='w-max gap-1 rounded-md btn p-2'>
                                                <sub.icon className='size-4.5 text-white transition duration-300 group-hover/link:scale-110' />
                                            </div>
                                            <div>
                                                <p className='font-medium'>{sub.name}</p>
                                                <p className='font-light text-gray-400'>{sub.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link key={link.name} to={link.href} className='transition hover:text-black'>
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <Link to='/login' className='font-medium text-gray-700 transition hover:text-black'>
                        Login
                    </Link>
                    <Link to='/register' className='rounded-full btn px-8 py-2.5 font-medium text-white transition hover:opacity-90'>
                        Sign Up
                    </Link>
                </div>

                <button onClick={() => setIsOpen(true)} className='transition active:scale-90 md:hidden'>
                    <MenuIcon className='size-6.5' />
                </button>
            </nav>

            <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white/20 text-lg font-medium backdrop-blur-2xl transition duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {links.map((link) => (
                    <div key={link.name} className='text-center'>
                        {link.subLinks ? (
                            <>
                                <button onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)} className='flex items-center justify-center gap-1 text-gray-800'>
                                    {link.name}
                                    <ChevronDown className={`size-4 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === link.name && (
                                    <div className='mt-2 flex flex-col gap-2 text-left text-sm'>
                                        {link.subLinks.map((sub) => (
                                            <Link key={sub.name} to={sub.href} className='block text-gray-600 transition hover:text-black' onClick={() => setIsOpen(false)}>
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link to={link.href} className='block text-gray-800 transition hover:text-black' onClick={() => setIsOpen(false)}>
                                {link.name}
                            </Link>
                        )}
                    </div>
                ))}

                <Link to='/' className='rounded-full btn px-8 py-2.5 font-medium text-white transition hover:opacity-90' onClick={() => setIsOpen(false)}>
                    Sign Up
                </Link>

                <button onClick={() => setIsOpen(false)} className='rounded-md btn p-2 text-white ring-white active:ring-2'>
                    <XIcon />
                </button>
            </div>
        </>
    );
}
