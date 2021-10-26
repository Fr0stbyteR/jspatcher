import ProxyClient from "./websocket/ProxyClient";
import type { IHistoryEvent } from "./file/History";
import type { ProjectItemManagerDataForBson } from "./file/PersistentProjectItemManager";
import type { ProjectProps } from "./Project";

export interface LiveShareProject {
    items: ProjectItemManagerDataForBson;
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
    hostRoom(timestamp: number, permission: "read" | "write", project: LiveShareProject): { roomInfo: RoomInfo };
    joinRoom(timestamp: number, roomId: string): { roomInfo: RoomInfo; project: LiveShareProject; history: ChangeEvent[] };
    closeRoom(roomId: string): void;
    logout(): void;
    requestChanges(roomId: string, ...events: ChangeEvent[]): Promise<ChangeEvent[]>;
}

export interface LiveShareClientEventMap {
    "roomStateChanged": RoomInfo;
    "roomClosedByOwner": string;
    "changesFrom": { username: string; events: ChangeEvent[] };
}

export default class LiveShareClient extends ProxyClient<ILiveShareClient, ILiveShareServer, LiveShareClientEventMap> {
    static fnNames: (keyof ILiveShareServer)[] = ["closeRoom", "hostRoom", "joinRoom", "login", "logout", "requestChanges"];
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
