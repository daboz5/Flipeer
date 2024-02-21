import useAppStore from "../useAppStore"
import useMap from "./useMap";


export default function useGame() {

    const { mapNums, setMapData } = useAppStore();
    const { createMapData } = useMap();

    const newGame = () => {
        let newData = createMapData(mapNums.mapSize);
        newData[Math.floor(newData.length / 2)].creature = { id: "player" };
        setMapData(newData);
    };

    return {
        newGame
    }
}