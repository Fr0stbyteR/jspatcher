import { getTimestamp } from "../utils/utils";
import LiveShareClient, { ChangeEvent, LiveShareProject, RoomInfo } from "./LiveShareClient";
import Patcher from "./patcher/Patcher";
import type Env from "./Env";
import type { IFileInstance } from "./file/FileInstance";
import { WebSocketLog } from "./websocket/ProxyClient.types";

export default class LiveShare {
    roomInfo: RoomInfo;
    readonly env: Env;
    readonly client = new LiveShareClient();
    clientId = "";
    username = "";
    instances = new Set<IFileInstance>();
    get logged() {
        return !this.clientId;
    }
    get isOwner() {
        return this.roomInfo.userIsOwner;
    }
    constructor(env: Env) {
        this.env = env;
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
                    instance = await file.instantiate({ env: this.env, project: this.env.currentProject });
                    this.env.openInstance(instance, true);
                }
                const [mergedEvent] = await instance.history.mergeEvents(event);
                events[i] = mergedEvent;
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
                    i.once("destroy", () => i.history.off("change", this.handlePatcherChange));
                    i.history.on("change", this.handlePatcherChange);
                }
            }
        });
    }
    handlePatcherChange = (changeEvent: ChangeEvent) => {
        if (this.logged) this.client.requestChanges(this.clientId, this.roomInfo.roomId, changeEvent);
    };
    async init(serverUrl: string) {
        this.client._serverUrl = serverUrl;
        await this.client._connect();
    }
    async login(username: string, password: string) {
        const timestamp = getTimestamp();
        try {
            this.clientId = await this.client.login(username, password, timestamp);
        } catch (error) {
            this.clientId = "";
            throw error;
        }
    }
    async join(roomId: string) {
        const timestamp = getTimestamp();
        const { roomInfo, project } = await this.client.joinRoom(this.clientId, timestamp, roomId);
        this.roomInfo = roomInfo;
        await this.env.newProject(project.props);
        await this.env.fileMgr.processDiff(project.items);
    }
    async hostRoom(permission: "write" | "read") {
        const project: LiveShareProject = { props: this.env.currentProject.props, items: this.env.fileMgr.getDataForDiff() };
        await this.client.hostRoom(this.clientId, getTimestamp(), permission, project);
    }
    async logout() {
        await this.client.logout(this.clientId);
        this.clientId = "";
    }
}
