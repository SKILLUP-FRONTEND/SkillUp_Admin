// stores/modalStore.ts
import { create } from "zustand";

type ModalState = {
    modal: React.ReactNode | null;
    openModal: (component: React.ReactNode) => void;
    closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
    modal: null,
    openModal: (component) => set({ modal: component }),
    closeModal: () => set({ modal: null }),
}));
