import { create } from 'zustand';
import { persist,devtools } from 'zustand/middleware';
import axios from 'axios';
import { backend_url } from '../constants/app_constants';

export type Client = {
    clientId: number;
    clientName: string;
    clientSpocName: string;
    clientSpocContact: string;
    clientLocation: string;
    createdAt: Date;
    lastUpdated: Date;
    jobTitle: string;
  };
export type State = {
    clients: Client[];
    isLoading: boolean;
    isInitialized: boolean;
};
export type Actions = {
    getClients: () => void;
    addClient: (client:Client) => Promise<Client>;
    updateClient: (client:Client) => Promise<Client>;
    deleteClient: (clientId:number) => void;

}
export const useClientStore = create<State & Actions>()(

    devtools((set, get) => ({
        clients: [],
        isLoading: false,
        isInitialized: false,
        getClients: async () => {
            set({ isLoading: true, isInitialized: false });
            try {
                const response = await axios.get(`${backend_url}/api/clients/`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                const data = response.data;
                set({
                    clients: data,
                    isLoading: false,
                    isInitialized: true
                });
                console.log('Clients in store:', get().clients);
            } catch (error) {
                console.error('Error fetching data from server:', error);
                set({ isLoading: false, isInitialized: true });
            }
            // implementation of getClients
        },
        addClient: async (client: Omit<Client, 'clientId' | 'createdAt' | 'lastUpdated'>) => {
            set({ isLoading: true });
            try {
              const response = await axios.post(`${backend_url}/api/clients/client`, client, {
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
                withCredentials: true,
              });
              const newClient = response.data;
            //   set((state) => ({
            //     clients: [...state.clients, newClient],
            //     isLoading: false,
            //   }));
              if(response.status == 200) {
                  get().getClients();
                  set({ isLoading: false });
              }
              console.log('Client Added');
              return newClient;
            } catch (error) {
              console.error('Error adding client:', error);
              set({ isLoading: false });
              throw new Error("Failed to add the Client");
            }
          },
      
        updateClient: async (client: Client) => {

            // implementation of updateClient
            set({ isLoading: true });
            try {
                const response = await axios.put(`${backend_url}/api/clients/client/${client.clientId}`,client,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                const updatedClient = response.data;
      
                set((state) => ({
                    clients: state.clients.map((c) => 
                    c.clientId === updatedClient.clientId ? updatedClient : c
                    ),
                    isLoading: false,
                    isInitialized: true,
                }));
                console.log('Client Updated');
                return updatedClient;
            } catch (error) {
                console.error('Error fetching data from server:', error);
                set({ isLoading: false, isInitialized: true });
                throw new Error("Failed to update the Client");
            }
        },
        deleteClient: async (clientId: number) => {

            // implementation of deleteClient
            set({ isLoading: true });
            try {
                const response = await axios.delete(`${backend_url}/api/clients/client/${clientId}`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                if(response.status == 200){
                    set((state) => ({
                        clients: state.clients.filter((c) => 
                        c.clientId !== clientId ),
                        isLoading: false,
                        isInitialized: true,
                    }));
                }
                console.log('Client Deleted');
            } catch (error) {
                console.error('Error deleting data from server:', error);
                set({ isLoading: false, isInitialized: true });
                throw new Error("Failed to delete the Client");
            }
        },
    })),
);