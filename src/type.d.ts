type TileType = "sea" | "vulcano";

type TileData = {
    coor: { x: number, y: number }
    creature: Creature | "player" | null;
    type: TileType;
};

type MapData = TileData[][];

type Creature = {
    id: number;
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

export {
    TileType,
    TileData,
    MapData,
    Creature
}