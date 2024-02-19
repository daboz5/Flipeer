import { create } from 'zustand';
import { Creature, SquareMapData, HexMapData } from './type';

type State = {
    player: Creature;
    squareSize: [number, number];
    hexSize: number;
    squareMapData: SquareMapData | null;
    hexMapData: HexMapData | null;
}

type Action = {
    setSquareSize(newSize: [number, number]): void,
    setHexSize(newSize: number): void,
    setSquareMapData(newMapData: SquareMapData | null): void,
    setHexMapData(newMapData: HexMapData | null): void,
    setPCData(newPCData: Creature): void,
}

const useAppStore = create<State & Action>((set) => ({

    squareSize: [10, 10],
    hexSize: 3,
    setSquareSize: (newSize) => set(() => ({
        squareSize: newSize
    })),
    setHexSize: (newSize) => set(() => ({
        hexSize: newSize
    })),

    player: {
        id: 0,
        hp: 5,
        maxHp: 5,
        attack: 0,
        defence: 0,
        energy: 3,
        maxEnergy: 3,
        sense: { fo: 1, si: 1, ba: 1 },
        move: { fo: 1, si: 1, ba: 1 },
        size: [1],
        resistence: [],
        color: "pink"
    },
    setPCData: (newPCData) => set(() => ({
        player: newPCData
    })),

    squareMapData: null,
    hexMapData: null,
    setSquareMapData: (newMapData) => set(() => ({
        squareMapData: newMapData
    })),
    setHexMapData: (newMapData) => set(() => ({
        hexMapData: newMapData
    }))
}));

export default useAppStore;