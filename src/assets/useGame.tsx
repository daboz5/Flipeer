import { Creature } from "../type";
import useAppStore from "../useAppStore"
import useCreature from "./useCreature";
import useMap from "./useMap";

export default function useGame() {

    const {
        mapNums,
        setMapData,
        setPlayer
    } = useAppStore();
    const { pcSight } = useCreature();
    const { createMapData } = useMap();

    const newGamePlayer: Creature = {
        name: "lupus lupus",
        type: "player",
        orientation: 0,
        alive: true,
        general: {
            awareness: {
                all: 1,
                lf: 0,
                f: 0,
                rf: 0,
                lb: 0,
                b: 0,
                rb: 0,
            },
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
        let index = Math.floor(newData.length / 2);
        newData[index].creature = newGamePlayer;
        setPlayer(newGamePlayer);
        pcSight(newGamePlayer, newData, index);
        setMapData(newData);
    };

    return {
        newGame
    }
}