import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { Song } from '@/types';

const useLoadImage = (song: Song) => {
    const supabaseClient = useSupabaseClient();

    if (!song) return null;

    const { data: image } = supabaseClient.storage
        .from('images')
        .getPublicUrl(song.image_path);

    return image.publicUrl;
};

export default useLoadImage;
