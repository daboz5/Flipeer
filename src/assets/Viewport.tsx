import useCreature from "./useCreature";
import MapTile from "../assets/MapTile";
import { useEffect } from "preact/hooks";
import useAppStore from "../useAppStore";

export default function Viewport() {

    const {
        startCreature,
        eventListenerMove,
        createCreature,
    } = useCreature();

    const { pos } = useAppStore();

    useEffect(() => {
        document.addEventListener("keydown", eventListenerMove);
        return () => document.removeEventListener("keydown", eventListenerMove);
    }, [eventListenerMove]);

    return (<>
        <div id="viewport">
            {createCreature(startCreature)}
            <MapTile />
        </div>
        <div style={{ position: "absolute", top: 400 }}>{pos.x},{pos.y}</div>
    </>)
}