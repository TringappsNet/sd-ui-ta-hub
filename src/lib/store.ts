import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { Column } from '../components/kanban/board-column';
import { UniqueIdentifier } from '@dnd-kit/core';
import axios from 'axios';
import { backend_url } from '../constants/app_constants';

// Use string type for dynamic column IDs
export type ColumnId = string;

// Update Status to use ColumnId
export type Status = ColumnId;

const defaultCols = [
  {
    id: 'TODO' as const,
    column: 'Todo'
  }
] satisfies Column[];


export type Task = {
  id: string;
  title: string;
  description?: string;
  status: ColumnId;
};

export type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
  isLoading: boolean;
  isInitialized: boolean;
};

const initialTasks: Task[] = [
  {
    id: 'task1',
    status: '1',
    title: 'Project initiation and planning'
  },
  {
    id: 'task2',
    status: '1',
    title: 'Gather requirements from stakeholders'
  }
];

export type Actions = {
  getCol: () => void;
  addTask: (title: string, description?: string) => void;
  addCol: (title: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  removeCol: (id: string) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (cols: Column[]) => void;
  updateCol: (id: string, newName: string) => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set,get) => ({
      tasks: initialTasks,
      columns: [],
      draggedTask: null,
      isLoading: false,
      isInitialized : false,
      getCol: async ()=> {
        try {
          const response = await axios.get(`${backend_url}/api/board/columns`,{
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
              },
              withCredentials: true,
          });
          const data = response.data;
          
          set({
              columns: data,
              isLoading: false,
              isInitialized: true
          });
        } catch (error) {
            console.error('Error fetching data from server:', error);
            set({ isLoading: false, isInitialized: true });
        }
      },
      addTask: (title: string, description?: string) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: uuid(), title, description, status: 'TODO' }
          ]
        })),
      updateCol: async (id: string, newName: string) =>{
        try {
          const response = await axios.put(`${backend_url}/api/board/column/${id}`,{"column":newName},{
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
              },
              withCredentials: true,
          });
          const data = response.data;
          
          if(response.status == 200){
            set(state => ({
              columns: state.columns.map((col) =>
                col.id === id ? { ...col, column: newName } : col
              ),
              isLoading: false,
              isInitialized: true,
            }));
          }
          
        } catch (error) {
            console.error('Error fetching data from server:', error);
            set({ isLoading: false, isInitialized: true });
        }
        },
      addCol: async (column: string) =>{
        try {
          const response = await axios.post(`${backend_url}/api/board/column`,{"column":column},{
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
              },
              withCredentials: true,
          });
          const data = response.data;
          console.log(response.status);
          console.log(data);
          if(response.status == 201){
            await get().getCol();
            set({
              isLoading: false,
              isInitialized: true,
            });
          }
          
        } catch (error) {
            console.error('Error fetching data from server:', error);
            set({ isLoading: false, isInitialized: true });
        }
      },
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      removeCol: async (id: string) => {
        try {
          const response = await axios.delete(`${backend_url}/api/board/column/${id}`,{
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
              },
              withCredentials: true,
          });
          const data = response.data;
          
          if(response.status == 200){
            set(state => ({
              
              columns: state.columns.filter((col) => col.id != id),
              isLoading: false,
              isInitialized: true,
            }));
          }
          
        } catch (error) {
            console.error('Error fetching data from server:', error);
            set({ isLoading: false, isInitialized: true });
        }
      },
        
      setTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
      setCols: (newCols: Column[]) => set({ columns: newCols })
    }),
    { name: 'task-store', skipHydration: true }
  )
);