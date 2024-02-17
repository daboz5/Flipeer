import useAppStore from "../useAppStore"
import useMap from "./useMap";


export default function useGame() {

    const { tileSize, setMapData } = useAppStore();
    const { createTileData } = useMap();


    const newGame = () => {
        let newTile = createTileData(tileSize);
        newTile[4][4].creature = { id: "player" };
        setMapData(newTile);
    };

    return { newGame }
}