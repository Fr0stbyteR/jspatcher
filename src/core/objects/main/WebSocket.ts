import { IArgsMeta, IInletsMeta, IOutletsMeta } from "../base/AbstractObject";
import { isBang } from "../base/Bang";
import DefaultObject from "../base/DefaultObject";

interface IS {
    socket: WebSocket;
}
export default class WS extends DefaultObject<{}, {}, [string | ArrayBufferLike | Blob | ArrayBufferView], [string | ArrayBufferLike | Blob | ArrayBufferView, WebSocket], [string], {}> {
    static description = "Send and receive from a WebSocket port";
    static inlets: IInletsMeta = [{
        isHot: false,
        type: "anything",
        description: "Data to send, Bang to connect"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Data received"
    }, {
        type: "object",
        description: "WebSocket connected"
    }];
    static args: IArgsMeta = [{
        type: "string",
        description: "WebSocket URL or Local Port number",
        optional: true,
        default: "80"
    }];
    _: IS = { socket: null };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        const disconnect = () => {
            try {
                this._.socket?.close();
            } catch (error) {
            }
            this._.socket = null;
        };
        const connect = async () => {
            const serverUrl = typeof this.args[0] === "number" ? `ws://localhost:${this.args[0]}` : this.args[0];
            if (!this._.socket) {
                this._.socket = new WebSocket(serverUrl);
            }
            const { socket } = this._;
            const handleOpen = () => {
                socket.removeEventListener("open", handleOpen);
                socket.removeEventListener("error", handleError);
                socket.addEventListener("message", handleMessage);
                socket.addEventListener("close", handleClose);
            };
            const handleMessage = async (e: MessageEvent<Blob>) => {
                this.outlet(0, e.data);
            };
            const handleError = (e: ErrorEvent) => {
                socket.removeEventListener("open", handleOpen);
                socket.removeEventListener("error", handleError);
                this.error(new Error(`WebSocket connect to '${serverUrl}' failed.`));
                disconnect();
            };
            const handleClose = (e: CloseEvent) => {
                socket.removeEventListener("open", handleOpen);
                socket.removeEventListener("error", handleError);
                socket.removeEventListener("message", handleMessage);
                socket.removeEventListener("close", handleClose);
                if (!e.wasClean) {
                    this.error(new Error(`WebSocket closed: ${e.code} - ${e.reason}`));
                }
                disconnect();
            };
            socket.addEventListener("open", handleOpen);
            socket.addEventListener("error", handleError);
            this.outlet(1, socket);
        };
        this.on("postInit", () => {
            connect();
        });
        this.on("argsUpdated", async () => {
            try {
                this._.socket?.close();
            } catch (error) {
            }
            this._.socket = null;
            connect();
        });
        this.on("inlet", ({ data }) => {
            if (isBang(data)) connect();
            if (isBang(data) || !data) return;
            this._.socket?.send(data);
        });
        this.on("destroy", disconnect);
    }
}
