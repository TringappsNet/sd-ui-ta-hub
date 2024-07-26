import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';


export type Task = {
  id: string;
  title: string;
  description: string | undefined;
  columnId: number;
}
export type columnType = {
  id: string;
  title: string;
  tasks: Task[];
}
const defaultCols = [
  {
    id: '2974db54-39ab-4050-884b-89a4693b00c0',
    title: 'Todo',
    tasks: [],
  },
  {
    id: '53bd4a28-beb7-447f-96e9-ba4c993f224d',
    title: 'In progress',
    tasks: [],
  }
] satisfies columnType[];

export type State = {
  tasks: Task[];
  columns: columnType[];
  isLoading: boolean;
  isInitialized: boolean;
};
export type Actions = {
  addTask: (title: string, description?: string) => void;
  addCol: (title: string) => void;
  initializeStore: () => void;
  fetchDataFromServer: () => void;
  // dragTask: (id: string | null) => void;
  // removeTask: (title: string) => void;
  // removeCol: (id: number) => void;
  // setTasks: (updatedTask: Task[]) => void;
  // setCols: (cols: Column[]) => void;
  // updateCol: (id: number, newName: string) => void;
};
// Zustand store
export const useKanbanStore = create<State & Actions>()(
  persist(
    (set, get)=>({
      tasks: [],
      columns: defaultCols,
      isLoading: false,
      isInitialized: false,
      addTask: (title, description) => {
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: "1",
              title,
              description,
              columnId: 1,
            }
          ]
        }));
      },
      addCol: (title) => {
        set((state) => ({
          columns: [...state.columns, { id: "1", title, tasks: [] }]
        }))
      },
      

      fetchDataFromServer: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get('your-api-endpoint');
          const data = response.data;
          
          set({
            tasks: data.tasks,
            columns: data.columns,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          console.error('Error fetching data from server:', error);
          set({ isLoading: false, isInitialized: true });
        }
      },

      initializeStore: async () => {
        const state = get();
        if (!state.isInitialized) {
          await state.fetchDataFromServer();
        }
      },
    }),
    { name: 'task-store', skipHydration: true }
    
  )
);

