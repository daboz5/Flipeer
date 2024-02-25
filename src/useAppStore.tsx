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
    setPlayer(newPCData: Creature): void,
}

const useAppStore = create<State & Action>((set) => ({
    mapNums: {
        mapRadius: 3,
        tileSize: 30,
        tileSpacing: 1
    },
    setMapNums: (newSize) => set(() => ({
        mapNums: newSize
    })),

    player: {
        name: "lupus lupus",
        type: "player",
        orientation: 0,
        general: {
            body: {
                color: "pink",
                size: 1,
                sizeMax: 2,
                segmentation: [],
            },
            combat: {
                attack: 0,
                defence: 0,
            },
            health: {
                energy: 3,
                energyMax: 3,
                energySourse: [],
                hp: 5,
                hpMax: 5,
                storage: 0,
                storageMax: 0,
            },
            movements: [],
            resistences: [],
            temperature: [{ scale: 2, description: "hot" }],
        },

    },
    setPlayer: (newPCData) => set(() => ({
        player: newPCData
    })),

    mapData: null,
    setMapData: (newMapData) => set(() => ({
        mapData: newMapData
    }))
}));

export default useAppStore;