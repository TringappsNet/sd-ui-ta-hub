import { create } from 'zustand';
import { persist,devtools } from 'zustand/middleware';
import axios from 'axios';
import { backend_url } from '../constants/app_constants';

export type Candidate = {
    candidateId: number; 
    candidateName: string;//
    candidateEmail: string;//
    candidateContact: string;//
    technology: string; 
    totalExperience: string;
    currentCtc: string;
    expectedCtc: string;
    noticePeriod: string;
    modeOfWork: string;
    currentLocation: string;
    candidateStatus: string;//
    comments: string;
    remarks: string;
    recruiter: string;
    recruitedSource: string;
    createdDate: Date; // Consider using Date if you're working with date objects
    lastUpdated: Date; // Consider using Date if you're working with date objects
    clientName: string;
    taskCandidateStatus: string;
  };
export type State = {
    candidates: Candidate[];
    isLoading: boolean;
    isInitialized: boolean;
};
export type Actions = {
    getCandidates: () => void;
    addCandidate: (candidate:Candidate) => Promise<Candidate>;
    updateCandidate: (candidate:Candidate) => Promise<Candidate>;
    deleteCandidate: (candidateId:number) => void;

}
export const useCandidateStore = create<State & Actions>()(

    devtools((set, get) => ({
        candidates: [],
        isLoading: false,
        isInitialized: false,
        getCandidates: async () => {
            set({ isLoading: true, isInitialized: false });
            try {
                const response = await axios.get(`${backend_url}/api/candidates/`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                const data = response.data;
                
                set({
                    candidates: data,
                    isLoading: false,
                    isInitialized: true
                });
                console.log('Candidates in store:', get().candidates);
            } catch (error) {
                console.error('Error fetching data from server:', error);
                set({ isLoading: false, isInitialized: true });
            }
            // implementation of getCandidates
        },
        addCandidate: async (candidate: Omit<Candidate, 'candidateId'>) => {
            set({ isLoading: true });
            try {
                const response = await axios.post(`${backend_url}/api/candidates/candidate`, candidate, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                const newCandidate = response.data;
                
                // set((state) => ({
                //     candidates: [...state.candidates, newCandidate],
                //     isLoading: false,
                // }));
                if(response.status == 200){
                    get().getCandidates();
                    set({isLoading: false,});
                }
                
                console.log('Candidate Added');
                return newCandidate;
            } catch (error) {
                console.error('Error adding candidate:', error);
                set({ isLoading: false });
                throw new Error("Failed to add the Candidate");
            }
        },
        updateCandidate: async (candidate: Candidate) => {

            // implementation of updateCandidate
            set({ isLoading: true });
            try {
                const response = await axios.put(`${backend_url}/api/candidates/candidate/${candidate.candidateId}`,candidate,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                const updatedCandidate = response.data;
      
                set((state) => ({
                    candidates: state.candidates.map((c) => 
                    c.candidateId === updatedCandidate.candidateId ? updatedCandidate : c
                    ),
                    isLoading: false,
                    isInitialized: true,
                }));
                console.log('Candidate Updated');
                return updatedCandidate;
            } catch (error) {
                console.error('Error fetching data from server:', error);
                set({ isLoading: false, isInitialized: true });
                throw new Error("Failed to update the Candidate");
            }
        },
        deleteCandidate: async (candidateId: number) => {

            // implementation of deleteCandidate
            set({ isLoading: true });
            try {
                const response = await axios.delete(`${backend_url}/api/candidates/candidate/${candidateId}`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                });
                if(response.status == 200){
                    set((state) => ({
                        candidates: state.candidates.filter((c) => 
                        c.candidateId !== candidateId ),
                        isLoading: false,
                        isInitialized: true,
                    }));
                }
                console.log('Candidate Deleted');
            } catch (error) {
                console.error('Error deleting data from server:', error);
                set({ isLoading: false, isInitialized: true });
                throw new Error("Failed to delete the Candidate");
            }
        },
    })),
);