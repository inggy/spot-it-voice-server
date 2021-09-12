import { SpotItSchema } from "../SpotItSchema";
import { User } from "../User";
import { createPresignedUrl } from "../../helper/AwsTranscribeUrlGenerator";

export function buildUser(id: string, name: string): User {
    const user = new User();
    user.name = name;
    user.id = id;
    return user;
}

export function addPlayerToGame(spotItSchema: SpotItSchema, user: User): void {
    spotItSchema.players[user.id] = user;
}

export function addSpectatorToGame(spotItSchema: SpotItSchema, user: User): void {
    spotItSchema.spectators[user.id] = user;
}

export function removeUserFromGame(spotItSchema: SpotItSchema, id: string): void {
    delete spotItSchema.players[id];
    delete spotItSchema.spectators[id];
    if (spotItSchema.gameState.hands) {
        delete spotItSchema.gameState.hands[id];
    }
}

export function getPlayer(spotItSchema: SpotItSchema, id: string): User {
    return spotItSchema.players[id];
}

export function getSpectator(spotItSchema: SpotItSchema, id: string): User {
    return spotItSchema.spectators[id];
}

export function getNumberOfPlayers(spotItSchema: SpotItSchema): number {
    return Object.keys(spotItSchema.players).length;
}

export function getPlayerIds(spotItSchema: SpotItSchema): string[] {
    return Object.keys(spotItSchema.players);
}