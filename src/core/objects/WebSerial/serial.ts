import { IInletsMeta, IOutletsMeta, IPropsMeta } from "../base/AbstractObject";
import { DefaultSerialObject } from "./Base";

interface IS {
    reading: boolean;
    port: SerialPort;
    reader: ReadableStreamDefaultReader;
    writer: WritableStreamDefaultWriter;
    textEncoder: TextEncoder;
    textDecoder: TextDecoder;
}
interface P extends Omit<SerialOptions, "baudRate"> {
    autoReturn: boolean;
}
export default class serial extends DefaultSerialObject<{}, {}, [any], [string, SerialPort], [number], P> {
    static description = "Send and receive from a serial port";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Data to send, Bang to connect"
    }];
    static outlets: IOutletsMeta = [{
        type: "string",
        description: "Data received"
    }, {
        type: "object",
        description: "SerialPort connected"
    }];
    static props: IPropsMeta<P> = {
        dataBits: {
            type: "enum",
            default: 8,
            enums: [7, 8],
            description: "The number of data bits per frame."
        },
        stopBits: {
            type: "enum",
            default: 1,
            enums: [1, 2],
            description: "The number of stop bits at the end of a frame."
        },
        parity: {
            type: "enum",
            default: "none",
            enums: ["none", "even", "odd"],
            description: "The parity mode."
        },
        bufferSize: {
            type: "number",
            default: 255,
            description: "A positive, non-zero value indicating the size of the read and write buffers that should be created."
        },
        flowControl: {
            type: "enum",
            default: "none",
            enums: ["none", "hardware"],
            description: "The flow control mode."
        },
        autoReturn: {
            type: "boolean",
            default: true,
            description: "Automatically append \\n when send data."
        }
    };
    _: IS = { reading: false, port: null, reader: null, writer: null, textEncoder: new TextEncoder(), textDecoder: new TextDecoder() };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        const disconnect = async () => {
            this._.reading = false;
            try {
                await this._.port?.close();
            } catch (error) {
            }
            try {
                await this._.reader?.cancel();
            } catch (error) {
            }
            try {
                await this._.writer?.close();
            } catch (error) {
            }
            this._.reader?.releaseLock();
            this._.port = null;
            this._.reader = null;
            this._.writer = null;
        };
        const connect = async () => {
            if (!this._.port) {
                this._.port = await navigator.serial.requestPort();
            }
            const { port } = this._;
            await port.open({
                baudRate: ~~Math.max(1, +this.args[0] || 9600),
                dataBits: this.getProp("dataBits"),
                stopBits: this.getProp("stopBits"),
                parity: this.getProp("parity"),
                bufferSize: ~~Math.max(1, +this.getProp("bufferSize") || 255),
                flowControl: this.getProp("flowControl")
            });
            this.outlet(1, port);
            const reader = port.readable?.getReader();
            const writer = port.writable?.getWriter();
            this._.reader = reader;
            this._.writer = writer;
            if (this._.reading) return;
            this._.reading = true;
            try {
                while (port.readable && this._.reader) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    const msg = this._.textDecoder.decode(value);
                    this.outlet(0, msg);
                }
            } catch (error) {
                this.error(error);
            } finally {
                disconnect();
            }
        };
        this.on("postInit", () => {
            connect();
        });
        this.on("propsUpdated", async () => {
            try {
                await this._.port?.close();
            } catch (error) {
            }
            connect();
        });
        this.on("argsUpdated", async () => {
            try {
                await this._.port?.close();
            } catch (error) {
            }
            connect();
        });
        this.on("inlet", ({ data }) => {
            const toSend = this._.textEncoder?.encode(`${typeof data === "string" ? data : JSON.stringify(data)}${this.props.autoReturn ? "\n" : ""}`);
            if (toSend) this._.writer?.write(toSend);
        });
        this.on("destroy", disconnect);
    }
}
