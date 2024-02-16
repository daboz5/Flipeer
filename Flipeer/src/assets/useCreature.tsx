import useAppStore from "../useAppStore";

export default function useCreature() {

    type Creature = {
        hp: number;
        maxHp: number;
        attack: number;
        defence: number;
        energy: number;
        sense: { fo: number, si: number, ba: number };
        move: { fo: number, si: number, ba: number };
        size: number[];
        resistence: string[];
        color: string;
    }

    const { x, y, setX, setY } = useAppStore();

    const startCreature: Creature = {
        hp: 5,
        maxHp: 5,
        attack: 0,
        defence: 0,
        energy: 3,
        sense: { fo: 1, si: 1, ba: 1 },
        move: { fo: 1, si: 1, ba: 1 },
        size: [1],
        resistence: [],
        color: "pink"
    }

    const createCreature = (data: Creature) => {
        const body = data.size.map((l) => {
            const bSegment = <div
                class="bSeg"
                style={{ backgroundColor: data.color }}>
            </div>
            const bSegArr = Array(l).fill(bSegment);
            return (<>{bSegArr}</>)
        });
        return (
            <div id="player" class="creature" style={{ top: 0, left: 0 }}>
                {body}
            </div>
        )
    }

    const eventListenerMove = (event: KeyboardEvent) => {
        const key = event.key;
        if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
            const pc = document.getElementById("player");
            if (!pc) { return }
            if (key === "ArrowUp") {
                setY(y - 40);
                pc.style.top = `${y - 40}px`;
            }
            else if (key === "ArrowLeft") {
                setX(x - 42);
                pc.style.left = `${x - 42}px`;
            }
            else if (key === "ArrowRight") {
                setX(x + 42);
                pc.style.left = `${x + 42}px`;
            }
            else if (key === "ArrowDown") {
                setY(y + 40);
                pc.style.top = `${y + 40}px`;
            }
        }
    }

    return {
        startCreature,
        createCreature,
        eventListenerMove
    }
}