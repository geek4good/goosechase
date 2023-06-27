type MissionCategory = 'text' | 'photo+video' | 'gps';

export interface BaseMission {
    name: string;
    description: string;
    points: number;
    category: MissionCategory;
    game_id: string;
}

export interface Mission extends BaseMission {
    id: string;
}