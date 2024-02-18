import toast from "react-hot-toast";
import useAppStore from "../useAppStore"
import useMap from "./useMap";


export default function useGame() {

    const { tileSize, setTileSize, setMapData } = useAppStore();
    const { createTileData } = useMap();


    const newGame = () => {
        let mid: [number, number] = [Math.floor(tileSize[0] / 2), Math.floor(tileSize[1] / 2)]
        let newTile = createTileData(tileSize);
        newTile[mid[0]][mid[1]].creature = { id: "player" };
        setMapData(newTile);
    };

    const setMapSize = (data: any) => {
        if (data) {
            const els: [HTMLInputElement, HTMLInputElement] = [data[1], data[2]];
            const size: [number, number] = [Number(els[0].value), Number(els[1].value)];
            setTileSize(size);
            toast.success("Size of next map was changed.")
        }
    }

    return { newGame, setMapSize }
}