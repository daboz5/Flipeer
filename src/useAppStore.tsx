import { create } from 'zustand';

type State = {
    scale: number,
    pos: { x: number, y: number },
}

type Action = {
    setPos(newPos: { x: number, y: number }): void,
}

const useAppStore = create<State & Action>((set) => ({
    scale: 40,

    pos: { x: 0, y: 0 },
    setPos: (newPosition) => set(() => ({
        pos: newPosition
    })),
}));

export default useAppStore;