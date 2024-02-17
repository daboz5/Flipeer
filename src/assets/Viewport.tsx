import { useEffect } from "preact/hooks";
import useAppStore from "../useAppStore";
import useCreature from "./useCreature";
import useGame from "./useGame";
import useMap from "./useMap";

export default function Viewport() {

    const { mapData } = useAppStore();
    const {
        eventListenerMove,
    } = useCreature();
    const { createTile } = useMap();
    const { newGame } = useGame();

    useEffect(() => {
        document.addEventListener("keydown", eventListenerMove);
        return () => document.removeEventListener("keydown", eventListenerMove);
    }, [eventListenerMove]);

    return (<>

        <div id="viewport">
            {mapData ? createTile(mapData) : <></>}
        </div>

        <button
            onClick={() => newGame()}>
            New Game
        </button>

    </>)
}