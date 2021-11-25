import { getTimestamp } from "../utils/utils";
import LiveShareClient, { ChangeEvent, LiveShareProject, RoomInfo } from "./LiveShareClient";
import Patcher from "./patcher/Patcher";
import type Env from "./Env";
import type { IFileInstance } from "./file/FileInstance";
import type { WebSocketLog } from "./websocket/ProxyClient.types";
import type PatcherHistory from "./patcher/PatcherHistory";

export default class LiveShare {
    roomInfo: RoomInfo;
    history: ChangeEvent[];
    readonly env: Env;
    readonly client = new LiveShareClient();
    clientId = "";
    username = "";
    instances = new Set<IFileInstance>();
    get logged() {
        return !!this.clientId;
    }
    get isOwner() {
        return !!this.roomInfo?.userIsOwner;
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
        const { roomInfo, project, history } = await this.client.joinRoom(timestamp, roomId);
        this.roomInfo = roomInfo;
        this.history = history;
        await this.env.newProject(project.props);
        await this.env.fileMgr.processBson(project.items);
    }
    async hostRoom(permission: "write" | "read") {
        const project: LiveShareProject = { props: this.env.currentProject.props, items: this.env.fileMgr.getDataForBson() };
        const { roomInfo } = await this.client.hostRoom(getTimestamp(), permission, project);
        this.roomInfo = roomInfo;
        this.history = [];
    }
    async logout() {
        await this.client.logout();
        this.clientId = "";
    }
}
