import { create } from 'zustand';
import { Creature, MapData } from './type';

type State = {
    player: Creature;
    mapNums: [number, number, number];
    mapData: MapData | null;
}

type Action = {
    setMapNums(newNums: [number, number, number]): void,
    setMapData(newMapData: MapData | null): void,
    setPCData(newPCData: Creature): void,
}

const useAppStore = create<State & Action>((set) => ({
    mapNums: [3, 30, 1],
    setMapNums: (newSize) => set(() => ({
        mapNums: newSize
    })),

    player: {
        id: 0,
        orientation: "F",
        general: {
            health: {
                hp: 5,
                hpMax: 5,
            },
            temperature: [{ scale: 2, description: "hot" }],
            attack: 0,
            defence: 0,
            food: {
                energy: 3,
                energyMax: 3,
                storage: 0,
                storageMax: 0,
                energySourse: [],
            },
            movement: [],
            resistences: [],
        },
        body: {
            bodySize: 1,
            bodySizeMax: 2,
            segmentation: [],
            color: "pink"
        },

    },
    setPCData: (newPCData) => set(() => ({
        player: newPCData
    })),

    mapData: null,
    setMapData: (newMapData) => set(() => ({
        mapData: newMapData
    }))
}));

export default useAppStore;