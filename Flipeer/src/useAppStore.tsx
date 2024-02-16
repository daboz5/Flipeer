import { create } from 'zustand';

type State = {
    x: number,
    y: number
}

type Action = {
    setX(x: number): void,
    setY(y: number): void,
}

const useAppStore = create<State & Action>((set) => ({
    x: 0,
    y: 0,
    setX: (newPosition) => set(() => ({
        x: newPosition
    })),
    setY: (newPosition) => set(() => ({
        y: newPosition
    })),
}));

export default useAppStore;