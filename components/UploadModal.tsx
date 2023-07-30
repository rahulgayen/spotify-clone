'use client';

import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

import useUploadModal from '@/hooks/useUploadModal';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import toast from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import uniqid from 'uniqid';

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const uploadModal = useUploadModal();
    const { user } = useUser();
    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        },
    });
    const supabasClient = useSupabaseClient();

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            return uploadModal.onClose();
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const song = values.song?.[0];
            const image = values.image?.[0];
            if (!song || !image || !user) {
                toast.error('Missing Fields');
                return;
            }
            const uniqId = uniqid();

            const { data: songData, error: songError } =
                await supabasClient.storage
                    .from('songs')
                    .upload(
                        `song-${values.title.split(' ').join('-')}-${uniqId}`,
                        song,
                        {
                            cacheControl: '3600',
                            upsert: false,
                        }
                    );
            if (songError) {
                setIsLoading(false);
                toast.error('Error while uploading song');
            }

            const { data: imageData, error: imageError } =
                await supabasClient.storage
                    .from('images')
                    .upload(
                        `song-${values.title.split(' ').join('-')}-${uniqId}`,
                        image,
                        {
                            cacheControl: '3600',
                            upsert: false,
                        }
                    );
            if (imageError) {
                setIsLoading(false);
                toast.error('Error while uploading image');
            }
            const { error: supabaseError } = await supabasClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData?.path,
                    songs_path: songData?.path,
                });
            if (supabaseError) {
                toast.error(supabaseError.message);
                setIsLoading(false);
            }
            router.refresh();
            setIsLoading(false);
            toast.success('Song created');
            reset();
            uploadModal.onClose();
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Add a song"
            isOpen={uploadModal.isOpen}
            description="Upload an mp3 file"
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input
                    id="title"
                    disabled={isLoading}
                    placeholder="Song Title"
                    {...register('title', { required: true })}
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    placeholder="Song author"
                    {...register('author', { required: true })}
                />
                <div className="">
                    <div className="pb-1">Select a song file</div>
                    <Input
                        id="song"
                        disabled={isLoading}
                        type="file"
                        accept=".mp3"
                        {...register('song', { required: true })}
                    />
                </div>
                <div className="">
                    <div className="pb-1">Select image</div>
                    <Input
                        id="image"
                        disabled={isLoading}
                        type="file"
                        accept="image/*"
                        {...register('image', { required: true })}
                    />
                </div>
                <Button type="submit" disabled={isLoading}>
                    Create
                </Button>
            </form>
        </Modal>
    );
};

export default UploadModal;
