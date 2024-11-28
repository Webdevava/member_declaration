import { create } from 'zustand';



export const useEditModeStore = create((set) => ({
  isEditModeEnabled: false,
  toggleEditMode: () => set((state) => ({ isEditModeEnabled: !state.isEditModeEnabled })),
}));