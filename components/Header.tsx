'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Button from './Button';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';

interface HeaderProps {
    children: ReactNode;
    className?: string;
}
const Header: React.FC<HeaderProps> = ({ children, className }) => {
    const authModal = useAuthModal();
    const router = useRouter();

    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        router.refresh();
        if (error) toast.error(error.message);
        else toast.success('Logged Out!');
    };
    return (
        <div
            className={twMerge(
                `h-fit bg-gradient-to-b from-emerald-800 p-4`,
                className
            )}
        >
            <div className="w-full mb-4 flex items-center justify-between">
                <div className="hidden md:flex gap-x-2 itrems-center">
                    <button className="rounded-full flex justify-center items-center bg-black hover:opacity-70 transition">
                        <RxCaretLeft size={35} className="text-white" />
                    </button>
                    <button className="rounded-full flex justify-center items-center bg-black hover:opacity-70 transition">
                        <RxCaretRight size={35} className="text-white" />
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button className="rounded-full p-2 bg-white flex justify-center items-center hover:opacity-70 transition">
                        <HiHome size={20} className="text-black" />
                    </button>
                    <button className="rounded-full p-2 bg-white flex justify-center items-center hover:opacity-70 transition">
                        <BiSearch size={20} className="text-black" />
                    </button>
                </div>
                <div className="flex justify-center items-center gap-x-4">
                    {user ? (
                        <>
                            <Button
                                onClick={handleLogout}
                                className="w-max whitespace-nowrap bg-white px-6 py-2"
                            >
                                Logout
                            </Button>
                            <Button onClick={() => router.push('/account')}>
                                <FaUserAlt />
                            </Button>
                        </>
                    ) : (
                        <>
                            <div>
                                <Button
                                    onClick={authModal.onOpen}
                                    className="bg-transparent text-neutral-300 font-medium"
                                >
                                    Sign up
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={authModal.onOpen}
                                    className="bg-white px-6 py-2"
                                >
                                    Login
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Header;
