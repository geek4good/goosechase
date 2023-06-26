type MissionCategory = 'text' | 'photo+video' | 'gps';

export interface BaseMission {
    name: string;
    description: string;
    points: number;
    category: MissionCategory;
}

export interface Mission {
    id: string;
}