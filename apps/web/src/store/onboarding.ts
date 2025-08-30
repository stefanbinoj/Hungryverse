import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ModalState {
    showOnboardingModal: boolean;
    setShowOnboardingModal: (val: boolean) => void;
}

export const useModalStore = create<ModalState>()(
    persist(
        (set) => ({
            showOnboardingModal: false,
            setShowOnboardingModal: (val: boolean) =>
                set({ showOnboardingModal: val }),
        }),
        {
            name: "onboardingModal", // key in localStorage
        },
    ),
);
