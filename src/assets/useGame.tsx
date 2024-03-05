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
        genepool: [{
            species: "lupus lupus",
            split: 0,
        }],
        orientation: 0,
        alive: true,
        general: {
            awareness: {
                all: 2,
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
                hp: 5,
                hpMax: 5,
                attack: 0,
                defence: 0,
            },
            energy: {
                stamina: 3,
                staminaMax: 3,
                metabolizes: [],
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