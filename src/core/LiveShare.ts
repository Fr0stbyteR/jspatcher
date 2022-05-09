import { getTimestamp } from "../utils/utils";
import LiveShareClient, { ChangeEvent, LiveShareProject, RoomInfo } from "./LiveShareClient";
import Patcher from "./patcher/Patcher";
import TypedEventEmitter from "../utils/TypedEventEmitter";
import type Env from "./Env";
import type { IFileInstance } from "./file/FileInstance";
import type { WebSocketLog } from "./websocket/ProxyClient.types";
import type PatcherHistory from "./patcher/PatcherHistory";
import { IHistoryData } from "./file/History";

export interface ILiveShareState {
    socketState: LiveShareClient["socketState"];
    ping: number;
    roomInfo: RoomInfo;
    clientId: string;
}

export interface LiveShareEventMap {
    "state": ILiveShareState;
}

export default class LiveShare extends TypedEventEmitter<LiveShareEventMap> {
    state: ILiveShareState = {
        socketState: "closed",
        ping: -1,
        roomInfo: null,
        clientId: null
    };
    roomInfo: RoomInfo;
    history: ChangeEvent[];
    readonly env: Env;
    readonly client = new LiveShareClient();
    clientId = "";
    username = "";
    instances = new Set<IFileInstance>();
    pingScheduled = false;
    $ping = -1;
    setState(state: Partial<ILiveShareState>) {
        this.state = { ...this.state, ...state };
        this.emit("state", this.state);
    }
    pingCallback = async () => {
        this.pingScheduled = false;
        this.$ping = -1;
        if (this.state.socketState !== "open") return;
        const t0 = getTimestamp();
        await this.client.pingServer(t0);
        const t1 = getTimestamp();
        this.setState({ ping: t1 - t0 });
        await this.client.reportPing(this.state.ping);
        this.schedulePing();
    };
    schedulePing = (timeout = 5000) => {
        if (this.pingScheduled) return;
        if (this.state.socketState !== "open") return;
        this.pingScheduled = true;
        this.$ping = window.setTimeout(this.pingCallback, timeout);
    };
    get logged() {
        return !!this.clientId;
    }
    get isOwner() {
        return !!this.roomInfo?.userIsOwner;
    }
    constructor(env: Env) {
        super();
        this.env = env;
        this.client.on("socketState", (socketState) => {
            const oldSocketState = this.state.socketState;
            this.setState({ socketState, clientId: socketState === "open" ? this.state.clientId : null });
            if (socketState === "open" && oldSocketState !== "open") this.schedulePing(0);
        });
        this.client.on("roomClosedByOwner", (roomId) => {
            if (this.roomInfo?.roomId === roomId) {
                this.roomInfo = undefined;
            }
        });
        this.client.on("roomStateChanged", (roomInfo: RoomInfo) => {
            if (roomInfo) {
                this.roomInfo = roomInfo;
            }
        });
        this.client.on("changesFrom", async ({ events }) => {
            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                let instance = Array.from(this.env.instances).find(i => i.file?.id === event.fileId);
                if (!instance) {
                    const file = this.env.fileMgr.getProjectItemFromId(event.fileId);
                    if (!file || file.isFolder === true) throw new Error(`No Such File ${event.fileId}`);
                    const editor = await file.instantiateEditor({ env: this.env, project: this.env.currentProject });
                    instance = editor.instance;
                    const historyEvents = this.history.filter(ce => ce.fileId === instance.file?.id);
                    await instance.history.mergeEvents(...historyEvents);
                    this.env.openEditor(editor, true);
                }
                const [mergedEvent] = await instance.history.mergeEvents(event);
                if (instance.history.editors.size) {
                    const [editor] = instance.history.editors;
                    await editor.save();
                }
                events[i] = mergedEvent;
                this.history.push(mergedEvent);
            }
            return events;
        });
        this.client._handleLog = (log: WebSocketLog) => {
            this.env.newLog(log.error ? "error" : "none", this.constructor.name, log.msg, this);
        };
        this.env.on("instances", (instances) => {
            for (const i of Array.from(this.instances)) {
                if (instances.indexOf(i) === -1) this.instances.delete(i);
            }
            for (const i of instances) {
                if (instances.indexOf(i) === -1) this.instances.add(i);
                if (i instanceof Patcher) {
                    i.once("ready", async () => {
                        if (!this.roomInfo) return;
                        if (!this.isOwner) {
                            const historyEvents = this.history.filter(ce => ce.fileId === i.file?.id);
                            await i.history.mergeEvents(...historyEvents);
                        }
                        i.history.on("change", this.handlePatcherChange);
                        i.once("destroy", () => i.history.off("change", this.handlePatcherChange));
                    });
                }
            }
        });
    }
    handlePatcherChange = (changeEvent: ChangeEvent, history: PatcherHistory) => {
        if (this.logged) {
            if (history.editors.size) {
                const [editor] = history.editors;
                editor.save();
            }
            this.client.requestChanges(this.roomInfo.roomId, changeEvent);
        }
    };
    async login(serverUrl: string, nickname: string, username?: string, password?: string) {
        if (this.state.clientId) {
            try {
                await this.logout();
            } catch (error) {
            }
        }
        this.client._serverUrl = serverUrl;
        try {
            await this.client._connect();
            const timestamp = getTimestamp();
            const clientId = await this.client.login(timestamp, nickname, username, password);
            this.setState({ clientId, roomInfo: null });
        } catch (error) {
            this.setState({ clientId: null, roomInfo: null });
            throw error;
        }
    }
    async setUsername(username: string) {

    }
    async join(roomId: string, password: string, username: string) {
        const timestamp = getTimestamp();
        const { roomInfo, project, history } = await this.client.joinRoom(roomId, username, password, timestamp);
        this.roomInfo = roomInfo;
        this.history = history;
        await this.env.newProject(project.props);
        await this.env.fileMgr.processBson(project.items);
    }
    async hostRoom(roomId: string, password: string, permission: "write" | "read") {
        const history: Record<string, IHistoryData> = {};
        this.instances.forEach((instance) => {
            history[instance.id] = instance.history.getSyncData();
        });
        const project: LiveShareProject = {
            props: this.env.currentProject.props,
            items: this.env.fileMgr.getDataForBson(),
            history
        };
        const { roomInfo } = await this.client.hostRoom(roomId, password, getTimestamp(), permission, project);
        this.setState({ roomInfo });
        this.history = [];
    }
    async logout() {
        try {
            await this.client.logout();
            await this.client._disconnect();
        } finally {
            this.setState({ clientId: null, roomInfo: null });
        }
    }
}
