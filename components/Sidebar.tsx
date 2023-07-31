'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import Box from './Box';
import SidebarItem from './SidebarItem';
import Library from './Library';
import { Song } from '@/types';
import { useUser } from '@/hooks/useUser';
import Button from './Button';
import useAuthModal from '@/hooks/useAuthModal';
import usePlayer from '@/hooks/usePlayer';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
    children: React.ReactNode;
    songs: Song[];
}
export const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
    const pathname = usePathname();
    const player = usePlayer();

    const { user } = useUser();
    const authModal = useAuthModal();
    const routes = useMemo(
        () => [
            {
                icon: HiHome,
                label: 'Home',
                active: pathname !== '/search',
                href: '/',
            },
            {
                icon: BiSearch,
                label: 'Search',
                active: pathname === '/search',
                href: '/search',
            },
        ],
        [pathname]
    );
    return (
        <div
            className={twMerge(
                'h-full flex flex-col',
                player.activeId && 'h-[calc(100%-80px)]'
            )}
        >
            <div className="flex flex-grow">
                {/* {children} */}
                <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
                    <Box className="text-green-500">
                        <div className="flex flex-col gap-y-4 px-5 py-4">
                            {routes.map((item) => (
                                <SidebarItem key={item.label} {...item} />
                            ))}
                        </div>
                    </Box>
                    <Box className="text-green-500 overflow-y-auto h-full">
                        <Library songs={songs} />
                    </Box>
                </div>
                <main className="h-full flex-1 overflow-y-auto py-2">
                    {children}
                </main>
            </div>
            {!user && (
                <div className="hidden md:flex w-[99%] h-[12vh] bg-gradient-to-r from-pink-600 to-sky-500 mx-2 mb-2 p-2 px-4 rounded-sm  justify-between">
                    <div className="basis-10/12">
                        <p className="uppercase ">Preview of Spotify</p>
                        <p className="font-semibold">
                            Sign up to get unlimited songs and podcasts with
                            occasional ads. No credit card needed.
                        </p>
                    </div>
                    <Button
                        onClick={authModal.onOpen}
                        className="bg-white text-black font-semibold basis-2/12"
                    >
                        Sign up free
                    </Button>
                </div>
            )}
        </div>
    );
};
