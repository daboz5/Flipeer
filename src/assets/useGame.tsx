import useAppStore from "../useAppStore"
import useMap from "./useMap";


export default function useGame() {

    const { mapNums, setMapData } = useAppStore();
    const { createMapData } = useMap();

    const newHexGame = () => {
        let newData = createMapData(mapNums[0]);
        newData[Math.floor(newData.length / 2)].creature = { id: "player" };
        setMapData(newData);
    };

    return {
        newHexGame
    }
}