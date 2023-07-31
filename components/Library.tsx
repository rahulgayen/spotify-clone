'use client';
import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import useUploadModal from '@/hooks/useUploadModal';
import { Song } from '@/types';
import MediaItem from './MediaItem';
import useOnPlay from '@/hooks/useOnPlay';

interface LibraryProps {
    songs: Song[];
}
const Library: React.FC<LibraryProps> = ({ songs }) => {
    const authModal = useAuthModal();
    const uploadModal = useUploadModal();
    const { user } = useUser();

    const handleOnclick = () => {
        if (!user) return authModal.onOpen();

        return uploadModal.onOpen();
    };

    const onPlay = useOnPlay(songs);
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex w-full items-center gap-x-2">
                    <TbPlaylist size={26} className="text-neutral-400" />
                    <p className="text-neutral-400 font-medium text-md">
                        Your Library
                    </p>
                </div>

                <AiOutlinePlus
                    onClick={handleOnclick}
                    size={20}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-3">
                {songs.map((song) => (
                    <MediaItem key={song.id} onClick={(id:string) => onPlay(id)} data={song} />
                ))}
            </div>
        </div>
    );
};

export default Library;
