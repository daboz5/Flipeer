/*MAP*/

type MapNumbers = {
    mapSize: number;
    tileSize: number;
    tileSpacing: number;
}

type TileType = "sea" | "atVulcano" | "vulcano";

type Temperatures = {
    scale: -3;
    description: "absolute";
} | {
    scale: -2;
    description: "freezing";
} | {
    scale: -1;
    description: "cold";
} | {
    scale: 0;
    description: "average";
} | {
    scale: 1;
    description: "warm";
} | {
    scale: 2;
    description: "hot";
} | {
    scale: 3;
    description: "melting";
} | {
    scale: 4;
    description: "hell";
}

type Resource = {
    type: string;
    amount: number;
}

type TileData = {
    type: TileType;
    values: {
        temperature: Temperatures;
        resources: Resource[];
    }
}

type Tile = {
    coor: { x: number, y: number, z: number };
    creature: Creature | { id: "player" } | null;
    terrain: TileData;
    context: {
        tiles: TileType[];
        border: boolean;
    }
};

/*CREATURE*/

type Segment = {} | {
    attack: number;
    defence: number;
    resistences: Resistence[];
    quirks: string[];
}

type Resistence = {
    type: string;
    effect: number;
}

type Movement = {
    type: string;
    drain: number;
}

type EnergySource = {
    type: string;
    metabolicRate: number;
}

type Creature = {
    id: number;
    orientation: number;
    general: {
        health: {
            hp: number;
            hpMax: number;
        };
        temperature: Temperatures[];
        attack: number;
        defence: number;
        food: {
            energy: number;
            energyMax: number;
            storage: number;
            storageMax: number;
            energySourse: EnergySource[];
        };
        movement: Movement[];
        resistences: Resistence[];
    };
    body: {
        bodySize: number;
        bodySizeMax: number;
        segmentation: Segment[];
        color: string;
    };
}

export {
    TileType,
    TileData,
    Tile,
    MapNumbers,
    Creature
}