import ProxyClient from "./websocket/ProxyClient";
import type { IHistoryEvent } from "./file/History";
import type { ProjectItemManagerDataForDiff } from "./file/PersistentProjectItemManager";
import type { ProjectProps } from "./Project";

export interface LiveShareProject {
    items: ProjectItemManagerDataForDiff;
    props: ProjectProps;
}

export interface ChangeEvent extends IHistoryEvent {}

export interface RoomInfo {
    roomId: string;
    permission: "read" | "write";
    clients: { username: string; ping: number; isOwner?: boolean }[];
    userIsOwner: boolean;
}

export interface ILiveShareClient {
    ping(timestamp: number, roomInfo?: RoomInfo): number;
    changesFrom(username: string, ...events: ChangeEvent[]): Promise<ChangeEvent[]>;
    roomClosedByOwner(roomId: string): void;
    roomStateChanged(roomInfo: RoomInfo): void;
}

export interface ILiveShareServer {
    login(username: string, password: string, timestamp: number): string;
    hostRoom(clientId: string, timestamp: number, permission: "read" | "write", project: LiveShareProject): { roomId: string };
    joinRoom(clientId: string, timestamp: number, roomId: string): { roomInfo: RoomInfo; project: LiveShareProject };
    closeRoom(clientId: string, roomId: string): void;
    logout(clientId: string): void;
    requestChanges(clientId: string, roomId: string, ...events: ChangeEvent[]): Promise<ChangeEvent[]>;
}

export interface LiveShareClientEventMap {
    "roomStateChanged": RoomInfo;
    "roomClosedByOwner": string;
    "changesFrom": { username: string; events: ChangeEvent[] };
}

export default class LiveShareClient extends ProxyClient<ILiveShareClient, ILiveShareServer, LiveShareClientEventMap> {
    ping(timestamp: number, roomInfo?: RoomInfo) {
        this.emit("roomStateChanged", roomInfo);
        return timestamp;
    }
    roomClosedByOwner(roomId: string) {
        this.emit("roomClosedByOwner", roomId);
    }
    roomStateChanged(roomInfo: RoomInfo) {
        this.emit("roomStateChanged", roomInfo);
    }
    async changesFrom(username: string, ...events: ChangeEvent[]) {
        const [mergedEvents] = await this.emit("changesFrom", { username, events });
        return mergedEvents;
    }
}
