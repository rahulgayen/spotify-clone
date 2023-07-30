import getSongsByTitle from '@/actions/getSongsByTitle';
import Header from '@/components/Header';
import SearchContents from '@/components/SearchContents';
import SearchInput from '@/components/SearchInput';

interface SearchProps {
    searchParams: {
        title: string;
    };
}

const Search: React.FC<SearchProps> = async ({ searchParams }) => {
    const songs = await getSongsByTitle(searchParams.title);

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-[99%] overflow-hidden overflow-y-auto">
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white font-semibold text-3xl">
                        Search
                    </h1>
                    <SearchInput />
                </div>
            </Header>
            <SearchContents songs={songs} />
        </div>
    );
};

export default Search;
