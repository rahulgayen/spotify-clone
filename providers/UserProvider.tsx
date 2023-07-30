'use client';

import { AppUserContextProvider } from '@/hooks/useUser';

interface UserProviderProps {
    children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    return <AppUserContextProvider>{children}</AppUserContextProvider>;
};

export default UserProvider;
