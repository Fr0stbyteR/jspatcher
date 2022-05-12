import ProxyClient from "./websocket/ProxyClient";
import type { IHistoryData, IHistoryEvent } from "./file/History";
import type { ProjectItemManagerDataForBson } from "./file/PersistentProjectItemManager";
import type { ProjectProps } from "./Project";

export interface LiveShareProject {
    items: ProjectItemManagerDataForBson;
    props: ProjectProps;
    history: Record<string, IHistoryData>;
}

export interface ChangeEvent extends IHistoryEvent {}

export interface RoomClientInfo {
    clientId: string;
    nickname: string;
    ping: number;
    isOwner?: boolean;
    selection: Record<string, string[]>;
    cursor: { editorId: string; position: number[] };
}

export interface RoomInfo {
    roomId: string;
    permission: "read" | "write";
    clients: RoomClientInfo[];
    userIsOwner: boolean;
}

export interface ILiveShareClient {
    ping(timestamp: number, roomInfo?: RoomInfo): number;
    changesFrom(username: string, ...events: ChangeEvent[]): Promise<ChangeEvent[]>;
    roomClosedByOwner(roomId: string): void;
    roomStateChanged(roomInfo: RoomInfo): void;
}

export interface ILiveShareServer {
    pingServer(timestamp: number): number;
    reportPing(ping: number): void;
    login(timestamp: number, nickname: string, username?: string, password?: string): string;
    logout(): void;
    hostRoom(roomId: string, password: string, timestamp: number, permission: "read" | "write", project: LiveShareProject): { roomInfo: RoomInfo };
    joinRoom(roomId: string, username: string, password: string, timestamp: number): { roomInfo: RoomInfo; project: LiveShareProject; history: ChangeEvent[] };
    transferOwnership(roomId: string, toClientId: string): RoomInfo;
    leaveRoom(roomId: string): void;
    closeRoom(roomId: string): void;
    requestChanges(roomId: string, ...events: ChangeEvent[]): Promise<ChangeEvent[]>;
}

export interface LiveShareClientEventMap {
    "roomStateChanged": RoomInfo;
    "roomClosedByOwner": string;
    "changesFrom": { username: string; events: ChangeEvent[] };
    "socketState": LiveShareClient["socketState"];
}

export default class LiveShareClient extends ProxyClient<ILiveShareClient, ILiveShareServer, LiveShareClientEventMap> {
    static fnNames: (keyof ILiveShareServer)[] = ["pingServer", "reportPing", "closeRoom", "hostRoom", "leaveRoom", "transferOwnership", "joinRoom", "login", "logout", "requestChanges"];
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
    get socketState() {
        if (!this._socket) return "closed";
        const state = this._socket.readyState;
        if (state === this._socket.OPEN) return "open";
        if (state === this._socket.CONNECTING) return "connecting";
        if (state === this._socket.CLOSING) return "closing";
        if (state === this._socket.CLOSED) return "closed";
        return "closed";
    }
    handleSocketOpen = () => this.emit("socketState", this.socketState);
    handleSocketClose = () => {
        this._socket.removeEventListener("open", this.handleSocketOpen);
        this._socket.removeEventListener("close", this.handleSocketClose);
        this.emit("socketState", this.socketState);
    };
    async _connect() {
        await super._connect();
        this.emit("socketState", this.socketState);
        this._socket.addEventListener("open", this.handleSocketOpen);
        this._socket.addEventListener("close", this.handleSocketClose);
    }
    async _disconnect() {
        super._disconnect();
        this.emit("socketState", this.socketState);
    }
}
