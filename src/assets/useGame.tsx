import useAppStore from "../useAppStore"
import useMap from "./useMap";


export default function useGame() {

    const { squareSize, hexNums, setSquareMapData, setHexMapData } = useAppStore();
    const { createTileData, createHexData } = useMap();


    const newSquareGame = () => {
        let mid: [number, number] = [
            Math.floor(squareSize[1] / 2),
            Math.floor(squareSize[0] / 2)
        ]
        let newData = createTileData(squareSize);
        newData[mid[0]][mid[1]].creature = { id: "player" };
        setHexMapData(null);
        setSquareMapData(newData);
    };

    const newHexGame = () => {
        let newData = createHexData(hexNums[0]);
        setSquareMapData(null);
        setHexMapData(newData);
    };

    return {
        newSquareGame,
        newHexGame
    }
}