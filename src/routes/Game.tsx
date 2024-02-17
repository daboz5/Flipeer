import { useEffect } from "preact/hooks";
import Viewport from "../assets/Viewport";
import "../assets/Creature.css";
import "../assets/Map.css";

export default function Game() {

    useEffect(() => {
    }, [])

    return (
        <div id={"gameBox"}>
            <Viewport />
        </div>
    )
}