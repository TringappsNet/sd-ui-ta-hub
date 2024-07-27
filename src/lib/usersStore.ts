import { create } from 'zustand';
import { persist,devtools } from 'zustand/middleware';
import axios from 'axios';
import { backend_url } from '../constants/app_constants';

export type User = {
    userId: number;
    roleId: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    resetToken: string;
    password: string;
    isActive: boolean;
    inviteToken: string;
    getgAccessToken: string;
    getgTokenExpiresIn: number;
    getgIdToken: string;
    getgAccessTokenCreatedAt: Date;
    currentSessionId: string;
    lastLoginTime: Date;
    createdAt: Date;
    lastUpdated: Date;
  };
export type State = {
    users: User[];
    isLoading: boolean;
    isInitialized: boolean;
};
export type Actions = {
    getUsers: () => void;
    addUser: (user:User) => void;
    updateUser: (user:User) => Promise<User>;
    deleteUser: (userId:number) => void;

}
export const useUserStore = create<State & Actions>()(

    devtools((set, get) => ({
        users: [],
        isLoading: false,
        isInitialized: false,
        getUsers: async () => {
            set({ isLoading: true });
            try {
                const response = await axios.get(`${backend_url}/api/users/`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                const data = response.data;
                
                set({
                    users: data,
                    isLoading: false,
                    isInitialized: true
                });
                console.log('Users in store:', get().users);
            } catch (error) {
                console.error('Error fetching data from server:', error);
                set({ isLoading: false, isInitialized: true });
            }
            // implementation of getUsers
        },
        addUser: (user: User) => {
            // implementation of addUser
        },
        updateUser: async (user: User) => {

            // implementation of updateUser
            set({ isLoading: true });
            try {
                const response = await axios.put(`${backend_url}/api/users/user/${user.userId}`,user,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                const updatedUser = response.data;
      
                set((state) => ({
                    users: state.users.map((c) => 
                    c.userId === updatedUser.userId ? updatedUser : c
                    ),
                    isLoading: false,
                    isInitialized: true,
                }));
                console.log('User Updated');
                return updatedUser;
            } catch (error) {
                console.error('Error fetching data from server:', error);
                set({ isLoading: false, isInitialized: true });
                throw new Error("Failed to update the User");
            }
        },
        deleteUser: async (userId: number) => {

            // implementation of deleteUser
            set({ isLoading: true });
            try {
                const response = await axios.delete(`${backend_url}/api/users/user/${userId}`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                if(response.status == 200){
                    set((state) => ({
                        users: state.users.filter((c) => 
                        c.userId !== userId ),
                        isLoading: false,
                        isInitialized: true,
                    }));
                }
                console.log('User Deleted');
            } catch (error) {
                console.error('Error deleting data from server:', error);
                set({ isLoading: false, isInitialized: true });
                throw new Error("Failed to delete the User");
            }
        },
    })),
);