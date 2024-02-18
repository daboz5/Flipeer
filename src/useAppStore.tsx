import { create } from 'zustand';
import { Creature, MapData } from './type';

type State = {
    player: Creature;
    tileSize: [number, number];
    mapData: MapData | null;
}

type Action = {
    setMapData(newMapData: MapData | null): void,
    setPCData(newPCData: Creature): void,
}

const useAppStore = create<State & Action>((set) => ({
    tileSize: [15, 15],

    player: {
        id: 0,
        hp: 5,
        maxHp: 5,
        attack: 0,
        defence: 0,
        energy: 3,
        sense: { fo: 1, si: 1, ba: 1 },
        move: { fo: 1, si: 1, ba: 1 },
        size: [1],
        resistence: [],
        color: "pink"
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