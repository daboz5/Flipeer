import { Creature } from "../type";
import useAppStore from "../useAppStore"
import useMap from "./useMap";

export default function useGame() {

    const {
        mapNums,
        setMapData,
        setPlayer
    } = useAppStore();
    const { createMapData } = useMap();

    const newGamePlayer: Creature = {
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
    }

    const newGame = () => {
        let newData = createMapData(mapNums.mapRadius);
        newData[Math.floor(newData.length / 2)].creature = newGamePlayer;
        setPlayer(newGamePlayer);
        setMapData(newData);
    };

    return {
        newGame
    }
}