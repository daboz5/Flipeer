import { useEffect } from "preact/hooks";
import useAppStore from "../useAppStore";
import useCreature from "../assets/useCreature";
import useGame from "../assets/useGame";
import useMap from "../assets/useMap";
import "../assets/Creature.css";
import "../assets/Map.css";
import "../assets/Menu.css";

export default function Game() {

    const { tileSize, mapData } = useAppStore();
    const {
        eventListenerMove,
    } = useCreature();
    const { createTile } = useMap();
    const { newGame, setMapSize } = useGame();

    useEffect(() => {
        document.addEventListener("keydown", eventListenerMove);
        return () => document.removeEventListener("keydown", eventListenerMove);
    }, [eventListenerMove]);

    return (<>

        <div id="viewport">
            {mapData ? createTile(mapData) : <></>}
        </div>
        <div id="menu" class={"colFlex"}>
            <button
                onClick={() => newGame()}>
                New Game
            </button>
            <form
                id="menuCngSize"
                class={"colFlex alignFlex"}
                onSubmit={(e) => {
                    e.preventDefault();
                    setMapSize(e.target);
                }}>
                <button
                    for="menuCngSize"
                    type={"submit"}>
                    Change Size
                </button>
                <label>
                    <input
                        type={"number"}
                        id="xInput"
                        placeholder={"x"}
                        required>
                    </input>
                    <input
                        type={"number"}
                        id="yInput"
                        placeholder={"y"}
                        required>
                    </input>
                </label>
            </form>
        </div>

    </>)
}