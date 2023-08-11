import * as React from "react";
import { Dropdown, Loader, Progress } from "semantic-ui-react";
// import AudioEditor from "../../core/audio/AudioEditor";
import Env, { EnvEventMap } from "../../core/Env";
import { IFileEditor } from "../../core/file/FileEditor";
// import PatcherEditor from "../../core/patcher/PatcherEditor";
// import AudioEditMenu from "./AudioEditMenu";
// import PatcherEditMenu from "./PatcherEditMenu";
import "./FlashMenu.scss";
import Patcher from "../../core/patcher/Patcher";
// import { NullLiteral } from "ts-morph";
import { dfu } from "./dfu/dfu";
import { fixInterfaceNames, getDFUDescriptorProperties, hexAddr8, niceSize } from "./dfu/utils";
import { dfuse } from "./dfu/dfuse";

const loaderDivStyle = {
    marginLeft: '1em'
}

interface P {
    env: Env;
    lang: string;
    onConnect?: () => void;
    onDisconnect?: () => void;
}

interface S {
    editor: IFileEditor;
    locked: boolean;
    building: boolean;
    build_message: string,
    build_error: boolean;
    error_message: string;
    device: dfuse.Device | null;
    progress: number | null;
}

export default class FlashMenu extends React.PureComponent<P, S> {
    state: S = {
        editor: this.props.env.activeEditor,
        locked: this.props.env.activeEditor == null,
        building: false,
        build_message: "",
        build_error: false,
        error_message: "",
        device: null,
        progress: null,
    };
    doDownload = async (firmware: ArrayBuffer) => {
        if (this.state.device) {
            const device = this.state.device;
            try {
                let status = await device.getStatus();
                if (status.state == dfu.dfuERROR) {
                    await device.clearStatus();
                }
            } catch (error) {
                this.props.env.newLog("error", "USB", "Failed to clear status");
            }

            const { TransferSize } = this.state.device.properties || { TransferSize: 1024 };

            await device.do_download(TransferSize, firmware, true).then(
                () => {
                    this.onDisconnect();
                    this.props.env.newLog("none", "USB", "Daisy disconnected.");
                },
                error => {
                    // this.onDisconnect();
                    this.props.env.newLog("error", "USB", error);
                }
            )
        }
    }
    // refInstanceEditMenu = React.createRef<PatcherEditMenu & AudioEditMenu>();
    handleClickBuild = async () => {

        if (this.state.locked || this.state.building)
            return;

        if (!await this.handleClickConnect()) {
            this.props.env.newLog("error", "USB", "No DFU device present.");
            return;
        }

        const data = await this.props.env.activeEditor.instance.serialize();
        const url = `${process.env.WS_DOMAIN}/ws/compile/`;
        const webSocket = new WebSocket(url);

        webSocket.onopen = (event) => {
            this.setState({ build_message: "Building program...", building: true, build_error: false, progress: null });
            webSocket.send(data);
        };

        // For now, we'll simply assume the connection ends here
        webSocket.onmessage = async (event) => {

            try {
                // console.log(event.data);
                let json = JSON.parse(event.data.toString('utf-8'));
                this.state.build_error = true;
                const error = json.Err;

                if (typeof error === 'string') {
                    this.state.error_message = `Encountered "${error}" error!`;
                } else {
                    const key = Object.keys(error)[0];

                    // Error reporting
                    if (key === 'InternalError') {
                        const inner_key = Object.keys(error[key])[0];
                        this.state.error_message = `Encountered internal "${inner_key}" error!`;
                        if (inner_key === 'CompileError') {
                            this.props.env.newLog("none", inner_key, error[key][inner_key].program.makefile);
                            this.props.env.newLog("none", inner_key, error[key][inner_key].program.cpp);
                            this.props.env.newLog("none", inner_key, error[key][inner_key].stderr);
                        } else {
                            this.props.env.newLog("none", inner_key, JSON.stringify(error[key][inner_key]));
                        }
                    } else {
                        this.state.error_message = `Encountered "${key}" error!`;
                        this.props.env.newLog("none", key, JSON.stringify(error[key]));
                    }
                }
            } catch (error) {
                // var saveData = (function () {
                //     var a = document.createElement("a");
                //     document.body.appendChild(a);

                //     a.style.display = "none";
                //     return function (data: BinaryData, fileName: string) {
                //         var blob = new Blob([data], { type: "octet/stream" });
                //         var url = window.URL.createObjectURL(blob);
                //         a.href = url;
                //         a.download = fileName;
                //         a.click();
                //         window.URL.revokeObjectURL(url);
                //     };
                // }());

                // saveData(event.data, "patcher.bin");
                let data = event.data as Blob;
                const buffer = await data.arrayBuffer();
                this.props.env.newLog("none", "USB", `Flashing ${buffer.byteLength} bytes to device.`);
                await this.doDownload(buffer);
            }

            this.state.building = false;
            this.forceUpdate();
        };

        webSocket.onerror = () => {
            this.setState({ build_message: "Error connecting to server. Please try again.", building: false, build_error: true });
        };
    };
    onDisconnect(reason?: string) {
        if (reason) {
            // statusDisplay.textContent = reason;
            console.log(reason);
        }
        this.setState({ device: null });
        if (this.props.onDisconnect) {
            this.props.onDisconnect();
        }
        navigator.usb.removeEventListener("disconnect", this.onUnexpectedDisconnect);
    }
    onUnexpectedDisconnect = (event: USBConnectionEvent) => {
        this.onDisconnect();
        this.props.env.newLog("none", "USB", "Unexpected Daisy disconnection.");
    }
    connect = async (deviceIn: dfu.Device) => {
        try {
            await deviceIn.open();
        } catch (error) {
            this.onDisconnect(error);
            throw error;
        }

        // Attempt to parse the DFU functional descriptor
        let desc: dfu.DFUProperties | void;
        try {
            desc = await getDFUDescriptorProperties(deviceIn);
        } catch (error) {
            this.onDisconnect(error);
            throw error;
        }

        let memorySummary = "";
        let deviceOut: dfuse.Device;
        if (desc && Object.keys(desc).length > 0) {
            deviceIn.properties = desc;

            if (desc.DFUVersion == 0x011a && deviceIn.settings.alternate.interfaceProtocol == 0x02) {

                // deviceOut = new dfuse.Device(deviceIn.device_, deviceIn.settings);
                const newDevice = new dfuse.Device(deviceIn.device_, deviceIn.settings);
                if (newDevice.memoryInfo) {
                    let totalSize = 0;
                    for (let segment of newDevice.memoryInfo.segments) {
                        totalSize += segment.end - segment.start;
                    }
                    memorySummary = `Selected memory region: ${newDevice.memoryInfo.name} (${niceSize(totalSize)})`;
                    for (let segment of newDevice.memoryInfo.segments) {
                        let properties = [];
                        if (segment.readable) {
                            properties.push("readable");
                        }
                        if (segment.erasable) {
                            properties.push("erasable");
                        }
                        if (segment.writable) {
                            properties.push("writable");
                        }
                        let propertySummary = properties.join(", ");
                        if (!propertySummary) {
                            propertySummary = "inaccessible";
                        }

                        memorySummary += `\n${hexAddr8(segment.start)}-${hexAddr8(segment.end - 1)} (${propertySummary})`;
                    }
                }

                let segment = newDevice.getFirstWritableSegment();
                if (segment) {
                    if (segment.start === 0x90000000)
                        segment.start += 0x40000
                    newDevice.startAddress = segment.start;
                }

                deviceOut = newDevice;
            } else {
                throw new Error("Device not supported");
            }
        }

        deviceOut.logFlashProgress = (done, total) => {
            const progress = Math.round((done / total) * 100);
            this.setState({ build_message: 'Flashing device...', progress });
        }

        deviceOut.logEraseProgress = (done, total) => {
            const progress = Math.round((done / total) * 100);
            this.setState({ build_message: 'Erasing device...', progress });
        }

        navigator.usb.addEventListener("disconnect", this.onUnexpectedDisconnect);
        this.props.env.newLog("none", "USB", memorySummary);
        if (this.props.onConnect) {
            this.props.onConnect();
        }

        return deviceOut;
    }
    autoConnect = async (vid: number, pid: number) => {
        const dfu_devices = await dfu.Device.findAllDfuInterfaces();

        let matching_devices = [];
        for (let dfu_device of dfu_devices) {
            if (dfu_device.device_.vendorId == vid && dfu_device.device_.productId == pid) {
                matching_devices.push(dfu_device);
            }
        }

        if (matching_devices.length == 0) {
            return null;
        } else {
            // TODO -- we may want to update this behavior in the future
            return matching_devices[0];
        }
    }

    handleClickConnect = async () => {

        const autoDevice = await this.autoConnect(0x0483, 0xdf11);
        if (autoDevice) {
            let interfaces = [autoDevice.settings]
            await fixInterfaceNames(autoDevice.device_, interfaces);
            const fixedDevice = new dfu.Device(autoDevice.device_, interfaces[0]);

            try {
                const device = await this.connect(fixedDevice);
                this.setState({ device });
                return true;
            } catch (e) {
                this.props.env.newLog("none", "USB", `Error connecting to device: ${e}`);
            }
        }

        let filters: Record<string, string>[] = [{ 'vendorId': '0x0483', 'productId': '0xdf11' }];

        try {
            const selectedDevice = await navigator.usb.requestDevice({ 'filters': filters });
            let interfaces = dfu.Device.findDeviceDfuInterfaces(selectedDevice);
            if (interfaces.length == 0) {
                this.setState({ device: null });
                this.props.env.newLog("error", "USB", "The selected device does not have any USB DFU interfaces.");
                return false;
            } else if (interfaces.length == 1) {
                await fixInterfaceNames(selectedDevice, interfaces);
                const device = await this.connect(new dfu.Device(selectedDevice, interfaces[0]));
                this.setState({ device });
            } else {
                await fixInterfaceNames(selectedDevice, interfaces);
                const connectToSelectedInterface = async () => {
                    let filteredInterfaceList = interfaces.filter(ifc => ifc.name.includes("0x08000000"));
                    if (filteredInterfaceList.length === 0) {
                        this.setState({ device: null });
                        this.props.env.newLog("error", "USB", "The selected device does not have a Flash Memory sectiona at address 0x08000000.");
                    } else {
                        const device = await this.connect(new dfu.Device(selectedDevice, filteredInterfaceList[0]));
                        this.setState({ device });
                    }
                }
                await connectToSelectedInterface();
            }

            return true;
        } catch (error) {
            return false;
        }
    }
    onShortKey(e: KeyboardEvent) {
        // if (this.state.locked) return false;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey && e.shiftKey && e.key === "F") {
            if (!this.state.building) {
                this.handleClickBuild();
                return true;
            }
        }
        return false;
    }
    handleLocked = (locked: boolean) => this.setState({ locked });
    handleActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => {
        this.state.locked = editor == null;
        this.forceUpdate();
    };
    componentDidMount() {
        this.props.env.on("activeEditor", this.handleActiveEditor);
    }
    componentWillUnmount() {
        this.props.env.off("activeEditor", this.handleActiveEditor);
        this.onDisconnect();
    }
    render() {
        const ctrlKey = this.props.env.os === "MacOS" ? "Cmd" : "Ctrl";
        const locked = this.state.locked || !this.state.editor;
        return (
            <div className="loader-container">
                <div>
                    <Dropdown item={true} icon={false} text="Daisy">
                        <Dropdown.Menu style={{ minWidth: "max-content" }}>
                            {/* <Dropdown.Item onClick={this.handleClickConnect} text="Connect" disabled={this.state.device !== null} /> */}
                            <Dropdown.Item onClick={this.handleClickBuild} text="Program" description={`${ctrlKey} + Shift + F`} disabled={this.state.locked || this.state.building} />
                            {/* {this.state.editor ? <Dropdown.Divider /> : undefined} */}
                            {/* {
                                this.state.editor instanceof PatcherEditor
                                    ? <PatcherEditMenu ref={this.refInstanceEditMenu} {...this.props} locked={this.state.locked} editor={this.state.editor} />
                                    : this.state.editor instanceof AudioEditor
                                        ? <AudioEditMenu ref={this.refInstanceEditMenu} {...this.props} locked={this.state.locked} editor={this.state.editor} />
                                        : undefined
                            } */}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {/* {this.state.device !== null ? <div className="monitor">Connected to {this.state.device.device_.productName}</div> : <div></div>} */}
                {this.state.building && this.state.progress === null ? <div style={loaderDivStyle}><Loader active inline size="mini"></Loader></div> : <div></div>}
                {this.state.building && this.state.progress !== null ? <div style={{ ...loaderDivStyle, width: '250px', alignSelf: 'center', marginBottom: '0' }}><Progress size="small" inverted active percent={this.state.progress} progress='percent'></Progress></div> : <div></div>
                }
                {this.state.building ? <div className="monitor">{this.state.build_message}</div> : <div></div>}
                {this.state.build_error ? <div className="monitor"> {this.state.error_message} </div> : <div></div>}
            </div >
        );
    }
}
