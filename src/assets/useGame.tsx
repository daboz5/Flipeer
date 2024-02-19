import useAppStore from "../useAppStore"
import useMap from "./useMap";


export default function useGame() {

    const { squareSize, hexSize, setSquareMapData, setHexMapData } = useAppStore();
    const { createTileData, createHexData } = useMap();


    const newSquareGame = () => {
        let mid: [number, number] = [
            Math.floor(squareSize[1] / 2),
            Math.floor(squareSize[0] / 2)
        ]
        let newData = createTileData(squareSize);
        newData[mid[0]][mid[1]].creature = { id: "player" };
        setSquareMapData(newData);
    };

    const newHexGame = () => {
        let newData = createHexData(hexSize);
        setHexMapData(newData);
    };

    return {
        newSquareGame,
        newHexGame
    }
}