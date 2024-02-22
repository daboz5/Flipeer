import { create } from 'zustand';
import { Creature, Tile, MapNumbers } from './type';

type State = {
    player: Creature;
    mapNums: MapNumbers;
    mapData: Tile[] | null;
}

type Action = {
    setMapNums(newNums: MapNumbers): void,
    setMapData(newMapData: Tile[] | null): void,
    setPlayerData(newPCData: Creature): void,
}

const useAppStore = create<State & Action>((set) => ({
    mapNums: {
        mapSize: 3,
        tileSize: 30,
        tileSpacing: 1
    },
    setMapNums: (newSize) => set(() => ({
        mapNums: newSize
    })),

    player: {
        id: "player",
        orientation: 0,
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
    setPlayerData: (newPCData) => set(() => ({
        player: newPCData
    })),

    mapData: null,
    setMapData: (newMapData) => set(() => ({
        mapData: newMapData
    }))
}));

export default useAppStore;