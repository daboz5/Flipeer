import { create } from 'zustand';
import { Creature, Tile, MapNumbers } from './type';

type State = {
    mapNums: MapNumbers;
    showCoor: boolean;
    showBorder: boolean;
    player: Creature | null;
    mapData: Tile[] | null;
}

type Action = {
    setMapNums(newNums: MapNumbers): void,
    switchShowCoor(): void,
    switchBorder(): void,
    setPlayer(newPCData: Creature): void,
    setMapData(newMapData: Tile[] | null): void,
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

    showCoor: true,
    switchShowCoor: () => set((state) => ({
        showCoor: !state.showCoor
    })),
    showBorder: false,
    switchBorder: () => set((state) => ({
        showBorder: !state.showBorder
    })),

    player: null,
    setPlayer: (newPCData) => set(() => ({
        player: newPCData
    })),

    mapData: null,
    setMapData: (newMapData) => set(() => ({
        mapData: newMapData
    }))
}));

export default useAppStore;