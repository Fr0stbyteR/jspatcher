export namespace dfu {
    export const DETACH = 0x00;
    export const DNLOAD = 0x01;
    export const UPLOAD = 0x02;
    export const GETSTATUS = 0x03;
    export const CLRSTATUS = 0x04;
    export const GETSTATE = 0x05;
    export const ABORT = 6;

    export const appIDLE = 0;
    export const appDETACH = 1;
    export const dfuIDLE = 2;
    export const dfuDNLOAD_SYNC = 3;
    export const dfuDNBUSY = 4;
    export const dfuDNLOAD_IDLE = 5;
    export const dfuMANIFEST_SYNC = 6;
    export const dfuMANIFEST = 7;
    export const dfuMANIFEST_WAIT_RESET = 8;
    export const dfuUPLOAD_IDLE = 9;
    export const dfuERROR = 10;

    export const STATUS_OK = 0x0;

    export interface Settings {
        configuration: USBConfiguration,
        interface: USBInterface,
        alternate: USBAlternateInterface,
        name?: string
    };

    export interface DFUProperties {
        WillDetach: boolean;
        ManifestationTolerant: boolean;
        CanUpload: boolean;
        CanDnload: boolean;
        TransferSize: number;
        DetachTimeOut: any;
        DFUVersion: any;
    };

    // Assuming device and settings are of `any` type since their types are not provided
    export class Device {
        public device_: USBDevice;
        public settings: Settings;
        public intfNumber: number;
        public disconnected: boolean;
        public properties: DFUProperties | null;

        constructor(device: USBDevice, settings: any) {
            this.device_ = device;
            this.settings = settings;
            this.intfNumber = settings["interface"].interfaceNumber;
            this.properties = null;
        }

        logEraseProgress(done: number, total?: number): void {

        };

        logFlashProgress(done: number, total?: number): void {

        };

        logDebug(msg: string): void {

        };

        logInfo(msg: string): void {
            console.log(msg);
        };

        logWarning(msg: string): void {
            console.log(msg);
        };

        logError(msg: string): void {
            console.log(msg);
        };

        logProgress(done: number, total?: number): void {
            // if (typeof total === 'undefined') {
            //     console.log(done)
            // } else {
            //     console.log(done + '/' + total);
            // }
        };

        public async open() {
            await this.device_.open();
            const confValue = this.settings.configuration.configurationValue;
            if (this.device_.configuration === null ||
                this.device_.configuration.configurationValue != confValue) {
                await this.device_.selectConfiguration(confValue);
            }

            const intfNumber = this.settings["interface"].interfaceNumber;
            if (!this.device_.configuration.interfaces[intfNumber].claimed) {
                await this.device_.claimInterface(intfNumber);
            }

            const altSetting = this.settings.alternate.alternateSetting;
            let intf = this.device_.configuration.interfaces[intfNumber];
            if (intf.alternate === null ||
                intf.alternate.alternateSetting != altSetting) {
                await this.device_.selectAlternateInterface(intfNumber, altSetting);
            }
        }

        public async close() {
            try {
                await this.device_.close();
            } catch (error) {
                console.log(error);
            }
        }

        public async readDeviceDescriptor() {
            const GET_DESCRIPTOR = 0x06;
            const DT_DEVICE = 0x01;
            const wValue = (DT_DEVICE << 8);

            return this.device_.controlTransferIn({
                "requestType": "standard",
                "recipient": "device",
                "request": GET_DESCRIPTOR,
                "value": wValue,
                "index": 0
            }, 18).then(
                (result: any) => {
                    if (result.status == "ok") {
                        return Promise.resolve(result.data);
                    } else {
                        return Promise.reject(result.status);
                    }
                }
            );
        }

        public async readStringDescriptor(index: number, langID?: number) {
            if (typeof langID === 'undefined') {
                langID = 0;
            }

            const GET_DESCRIPTOR = 0x06;
            const DT_STRING = 0x03;
            const wValue = (DT_STRING << 8) | index;

            const request_setup: USBControlTransferParameters = {
                "requestType": "standard",
                "recipient": "device",
                "request": GET_DESCRIPTOR,
                "value": wValue,
                "index": langID
            }

            // Read enough for bLength
            var result = await this.device_.controlTransferIn(request_setup, 1);

            if (result.status == "ok") {
                // Retrieve the full descriptor
                const bLength = result.data.getUint8(0);
                result = await this.device_.controlTransferIn(request_setup, bLength);
                if (result.status == "ok") {
                    const len = (bLength - 2) / 2;
                    let u16_words = [];
                    for (let i = 0; i < len; i++) {
                        u16_words.push(result.data.getUint16(2 + i * 2, true));
                    }
                    if (langID == 0) {
                        // Return the langID array
                        return u16_words;
                    } else {
                        // Decode from UCS-2 into a string
                        return String.fromCharCode.apply(String, u16_words);
                    }
                }
            }

            throw `Failed to read string descriptor ${index}: ${result.status}`;
        }

        public async readInterfaceNames() {
            const DT_INTERFACE = 4;

            let configs: Record<number, any> = {};
            let allStringIndices = new Set<number>();
            for (let configIndex = 0; configIndex < this.device_.configurations.length; configIndex++) {
                const rawConfig = await this.readConfigurationDescriptor(configIndex);
                let configDesc = Device.parseConfigurationDescriptor(rawConfig);
                let configValue = configDesc.bConfigurationValue;
                configs[configValue] = {};

                // Retrieve string indices for interface names
                for (let desc of configDesc.descriptors) {
                    if (desc.bDescriptorType == DT_INTERFACE) {
                        if (!(desc.bInterfaceNumber in configs[configValue])) {
                            configs[configValue][desc.bInterfaceNumber] = {};
                        }
                        configs[configValue][desc.bInterfaceNumber][desc.bAlternateSetting] = desc.iInterface;
                        if (desc.iInterface > 0) {
                            allStringIndices.add(desc.iInterface);
                        }
                    }
                }
            }

            let strings: Record<number, string> = {};
            // Retrieve interface name strings
            for (let index of allStringIndices) {
                try {
                    strings[index] = await this.readStringDescriptor(index, 0x0409);
                } catch (error) {
                    console.log(error);
                    strings[index] = null;
                }
            }

            for (let configValue in configs) {
                for (let intfNumber in configs[configValue]) {
                    for (let alt in configs[configValue][intfNumber]) {
                        const iIndex = configs[configValue][intfNumber][alt];
                        configs[configValue][intfNumber][alt] = strings[iIndex];
                    }
                }
            }

            return configs;
        }

        static findDeviceDfuInterfaces(device: USBDevice) {
            let interfaces = [];
            for (let conf of device.configurations) {
                for (let intf of conf.interfaces) {
                    for (let alt of intf.alternates) {
                        if (alt.interfaceClass == 0xFE &&
                            alt.interfaceSubclass == 0x01 &&
                            (alt.interfaceProtocol == 0x01 || alt.interfaceProtocol == 0x02)) {
                            let settings = {
                                "configuration": conf,
                                "interface": intf,
                                "alternate": alt,
                                "name": alt.interfaceName
                            };
                            interfaces.push(settings);
                        }
                    }
                }
            }

            return interfaces;
        }

        static findAllDfuInterfaces() {
            return navigator.usb.getDevices().then(
                devices => {
                    let matches = [];
                    for (let device of devices) {
                        let interfaces = Device.findDeviceDfuInterfaces(device);
                        for (let interface_ of interfaces) {
                            matches.push(new Device(device, interface_))
                        }
                    }
                    return matches;
                }
            )
        }

        static parseDeviceDescriptor(data: DataView) {
            return {
                bLength: data.getUint8(0),
                bDescriptorType: data.getUint8(1),
                bcdUSB: data.getUint16(2, true),
                bDeviceClass: data.getUint8(4),
                bDeviceSubClass: data.getUint8(5),
                bDeviceProtocol: data.getUint8(6),
                bMaxPacketSize: data.getUint8(7),
                idVendor: data.getUint16(8, true),
                idProduct: data.getUint16(10, true),
                bcdDevice: data.getUint16(12, true),
                iManufacturer: data.getUint8(14),
                iProduct: data.getUint8(15),
                iSerialNumber: data.getUint8(16),
                bNumConfigurations: data.getUint8(17),
            };
        }

        static parseConfigurationDescriptor(data: DataView) {
            let descriptorData = new DataView(data.buffer.slice(9));
            let descriptors = Device.parseSubDescriptors(descriptorData);
            return {
                bLength: data.getUint8(0),
                bDescriptorType: data.getUint8(1),
                wTotalLength: data.getUint16(2, true),
                bNumInterfaces: data.getUint8(4),
                bConfigurationValue: data.getUint8(5),
                iConfiguration: data.getUint8(6),
                bmAttributes: data.getUint8(7),
                bMaxPower: data.getUint8(8),
                descriptors: descriptors
            };
        }

        static parseInterfaceDescriptor(data: DataView) {
            return {
                bLength: data.getUint8(0),
                bDescriptorType: data.getUint8(1),
                bInterfaceNumber: data.getUint8(2),
                bAlternateSetting: data.getUint8(3),
                bNumEndpoints: data.getUint8(4),
                bInterfaceClass: data.getUint8(5),
                bInterfaceSubClass: data.getUint8(6),
                bInterfaceProtocol: data.getUint8(7),
                iInterface: data.getUint8(8),
                descriptors: [] as any[]
            };
        }

        static parseFunctionalDescriptor(data: DataView) {
            return {
                bLength: data.getUint8(0),
                bDescriptorType: data.getUint8(1),
                bmAttributes: data.getUint8(2),
                wDetachTimeOut: data.getUint16(3, true),
                wTransferSize: data.getUint16(5, true),
                bcdDFUVersion: data.getUint16(7, true)
            };
        }

        static DT_INTERFACE = 4;
        static DT_ENDPOINT = 5;
        static DT_DFU_FUNCTIONAL = 0x21;
        static USB_CLASS_APP_SPECIFIC = 0xFE;
        static USB_SUBCLASS_DFU = 0x01;
        static GET_DESCRIPTOR = 0x06;
        static DT_CONFIGURATION = 0x02;

        static parseSubDescriptors(descriptorData: DataView) {
            const DT_INTERFACE = 4;
            const DT_ENDPOINT = 5;
            const DT_DFU_FUNCTIONAL = 0x21;
            const USB_CLASS_APP_SPECIFIC = 0xFE;
            const USB_SUBCLASS_DFU = 0x01;
            let remainingData = descriptorData;
            let descriptors = [];
            let currIntf;
            let inDfuIntf = false;
            while (remainingData.byteLength > 2) {
                let bLength = remainingData.getUint8(0);
                let bDescriptorType = remainingData.getUint8(1);
                let descData = new DataView(remainingData.buffer.slice(0, bLength));
                if (bDescriptorType == DT_INTERFACE) {
                    currIntf = Device.parseInterfaceDescriptor(descData);
                    if (currIntf.bInterfaceClass == USB_CLASS_APP_SPECIFIC &&
                        currIntf.bInterfaceSubClass == USB_SUBCLASS_DFU) {
                        inDfuIntf = true;
                    } else {
                        inDfuIntf = false;
                    }
                    descriptors.push(currIntf);
                } else if (inDfuIntf && bDescriptorType == DT_DFU_FUNCTIONAL) {
                    let funcDesc = Device.parseFunctionalDescriptor(descData)
                    descriptors.push(funcDesc);
                    currIntf.descriptors.push(funcDesc);
                } else {
                    let desc = {
                        bLength: bLength,
                        bDescriptorType: bDescriptorType,
                        data: descData
                    };
                    descriptors.push(desc);
                    if (currIntf) {
                        currIntf.descriptors.push(desc);
                    }
                }
                remainingData = new DataView(remainingData.buffer.slice(bLength));
            }

            return descriptors;
        }

        public async readConfigurationDescriptor(index: number) {
            const GET_DESCRIPTOR = 0x06;
            const DT_CONFIGURATION = 0x02;
            const wValue = ((DT_CONFIGURATION << 8) | index);

            return this.device_.controlTransferIn({
                "requestType": "standard",
                "recipient": "device",
                "request": GET_DESCRIPTOR,
                "value": wValue,
                "index": 0
            }, 4).then(
                result => {
                    if (result.status == "ok") {
                        // Read out length of the configuration descriptor
                        let wLength = result.data.getUint16(2, true);
                        return this.device_.controlTransferIn({
                            "requestType": "standard",
                            "recipient": "device",
                            "request": GET_DESCRIPTOR,
                            "value": wValue,
                            "index": 0
                        }, wLength);
                    } else {
                        return Promise.reject(result.status);
                    }
                }
            ).then(
                result => {
                    if (result.status == "ok") {
                        return Promise.resolve(result.data);
                    } else {
                        return Promise.reject(result.status);
                    }
                }
            );
        }

        public async requestOut(bRequest: any, data?: any, wValue: number = 0) {
            return this.device_.controlTransferOut({
                "requestType": "class",
                "recipient": "interface",
                "request": bRequest,
                "value": wValue,
                "index": this.intfNumber
            }, data).then(
                result => {
                    if (result.status == "ok") {
                        return Promise.resolve(result.bytesWritten);
                    } else {
                        return Promise.reject(result.status);
                    }
                },
                error => {
                    return Promise.reject("ControlTransferOut failed: " + error);
                }
            );
        }

        public async requestIn(bRequest: any, wLength: any, wValue: number = 0) {
            return this.device_.controlTransferIn({
                "requestType": "class",
                "recipient": "interface",
                "request": bRequest,
                "value": wValue,
                "index": this.intfNumber
            }, wLength).then(
                result => {
                    if (result.status == "ok") {
                        return Promise.resolve(result.data);
                    } else {
                        return Promise.reject(result.status);
                    }
                },
                error => {
                    return Promise.reject("ControlTransferIn failed: " + error);
                }
            );
        }

        public async detach() {
            return this.requestOut(dfu.DETACH, undefined, 1000);
        }

        public async waitDisconnected(timeout: number) {
            let device = this;
            let usbDevice = this.device_;
            return new Promise(function (resolve, reject) {
                let timeoutID: any;
                if (timeout > 0) {
                    function onTimeout() {
                        navigator.usb.removeEventListener("disconnect", onDisconnect);
                        if (device.disconnected !== true) {
                            reject("Disconnect timeout expired");
                        }
                    }
                    timeoutID = setTimeout(reject, timeout);
                }

                function onDisconnect(event: USBConnectionEvent) {
                    if (event.device === usbDevice) {
                        if (timeout > 0) {
                            clearTimeout(timeoutID);
                        }
                        device.disconnected = true;
                        navigator.usb.removeEventListener("disconnect", onDisconnect);
                        event.stopPropagation();
                        resolve(device);
                    }
                }

                navigator.usb.addEventListener("disconnect", onDisconnect);
            });
        }

        public async download(data: ArrayBuffer, blockNum: number) {
            return this.requestOut(dfu.DNLOAD, data, blockNum);
        }

        public dnload = this.download;

        public async upload(length: number, blockNum: number) {
            return this.requestIn(dfu.UPLOAD, length, blockNum)
        }

        public async clearStatus() {
            return this.requestOut(dfu.CLRSTATUS);
        }

        public clrStatus = this.clearStatus;

        public async getStatus() {
            return this.requestIn(dfu.GETSTATUS, 6).then(
                data =>
                    Promise.resolve({
                        "status": data.getUint8(0),
                        "pollTimeout": data.getUint32(1, true) & 0xFFFFFF,
                        "state": data.getUint8(4)
                    }),
                error =>
                    Promise.reject("DFU GETSTATUS failed: " + error)
            );
        }

        public async getState() {
            return this.requestIn(dfu.GETSTATE, 1).then(
                data => Promise.resolve(data.getUint8(0)),
                error => Promise.reject("DFU GETSTATE failed: " + error)
            );
        }

        public async abort() {
            return this.requestOut(dfu.ABORT);
        }

        public async abortToIdle() {
            await this.abort();
            let state = await this.getState();
            if (state == dfu.dfuERROR) {
                await this.clearStatus();
                state = await this.getState();
            }
            if (state != dfu.dfuIDLE) {
                throw "Failed to return to idle state after abort: state " + state;
            }
        }

        public async do_upload(xfer_size: number, max_size: number = Infinity, first_block: number = 0) {
            let transaction = first_block;
            let blocks = [];
            let bytes_read = 0;

            this.logInfo("Copying data from DFU device to browser");
            // Initialize progress to 0
            this.logProgress(0);

            let result;
            let bytes_to_read;
            do {
                bytes_to_read = Math.min(xfer_size, max_size - bytes_read);
                result = await this.upload(bytes_to_read, transaction++);
                this.logDebug("Read " + result.byteLength + " bytes");
                if (result.byteLength > 0) {
                    blocks.push(result);
                    bytes_read += result.byteLength;
                }
                if (Number.isFinite(max_size)) {
                    this.logProgress(bytes_read, max_size);
                } else {
                    this.logProgress(bytes_read);
                }
            } while ((bytes_read < max_size) && (result.byteLength == bytes_to_read));

            if (bytes_read == max_size) {
                await this.abortToIdle();
            }

            this.logInfo(`Read ${bytes_read} bytes`);

            return new Blob(blocks, { type: "application/octet-stream" });
        }

        public async poll_until(state_predicate: (n: number) => boolean) {
            let dfu_status = await this.getStatus();

            let device = this;
            const async_sleep = (duration_ms: number) => {
                return new Promise(function (resolve, reject) {
                    device.logDebug("Sleeping for " + duration_ms + "ms");
                    setTimeout(resolve, duration_ms);
                });
            }

            while (!state_predicate(dfu_status.state) && dfu_status.state != dfu.dfuERROR) {
                await async_sleep(dfu_status.pollTimeout);
                dfu_status = await this.getStatus();
            }

            return dfu_status;
        }

        public poll_until_idle(idle_state: any) {
            return this.poll_until(state => (state == idle_state));
        }

        public async do_download(xfer_size: number, data: Uint8Array, manifestationTolerant: boolean) {
            let bytes_sent = 0;
            let expected_size = data.byteLength;
            let transaction = 0;

            this.logInfo("Copying data from browser to DFU device");

            // Initialize progress to 0
            this.logProgress(bytes_sent, expected_size);

            while (bytes_sent < expected_size) {
                const bytes_left = expected_size - bytes_sent;
                const chunk_size = Math.min(bytes_left, xfer_size);

                let bytes_written = 0;
                let dfu_status;
                try {
                    bytes_written = await this.download(data.slice(bytes_sent, bytes_sent + chunk_size), transaction++);
                    this.logDebug("Sent " + bytes_written + " bytes");
                    dfu_status = await this.poll_until_idle(dfu.dfuDNLOAD_IDLE);
                } catch (error) {
                    throw "Error during DFU download: " + error;
                }

                if (dfu_status.status != dfu.STATUS_OK) {
                    throw `DFU DOWNLOAD failed state=${dfu_status.state}, status=${dfu_status.status}`;
                }

                this.logDebug("Wrote " + bytes_written + " bytes");
                bytes_sent += bytes_written;

                this.logProgress(bytes_sent, expected_size);
            }

            this.logDebug("Sending empty block");
            try {
                await this.download(new ArrayBuffer(0), transaction++);
            } catch (error) {
                throw "Error during final DFU download: " + error;
            }

            this.logInfo("Wrote " + bytes_sent + " bytes");
            this.logInfo("Manifesting new firmware");

            if (manifestationTolerant) {
                // Transition to MANIFEST_SYNC state
                let dfu_status;
                try {
                    // Wait until it returns to idle.
                    // If it's not really manifestation tolerant, it might transition to MANIFEST_WAIT_RESET
                    dfu_status = await this.poll_until(state => (state == dfu.dfuIDLE || state == dfu.dfuMANIFEST_WAIT_RESET));
                    if (dfu_status.state == dfu.dfuMANIFEST_WAIT_RESET) {
                        this.logDebug("Device transitioned to MANIFEST_WAIT_RESET even though it is manifestation tolerant");
                    }
                    if (dfu_status.status != dfu.STATUS_OK) {
                        throw `DFU MANIFEST failed state=${dfu_status.state}, status=${dfu_status.status}`;
                    }
                } catch (error) {
                    if (error.endsWith("ControlTransferIn failed: NotFoundError: Device unavailable.") ||
                        error.endsWith("ControlTransferIn failed: NotFoundError: The device was disconnected.")) {
                        this.logWarning("Unable to poll final manifestation status");
                    } else {
                        throw "Error during DFU manifest: " + error;
                    }
                }
            } else {
                // Try polling once to initiate manifestation
                try {
                    let final_status = await this.getStatus();
                    this.logDebug(`Final DFU status: state=${final_status.state}, status=${final_status.status}`);
                } catch (error) {
                    this.logDebug("Manifest GET_STATUS poll error: " + error);
                }
            }

            // Reset to exit MANIFEST_WAIT_RESET
            try {
                await this.device_.reset();
            } catch (error) {
                if (error == "NetworkError: Unable to reset the device." ||
                    error == "NotFoundError: Device unavailable." ||
                    error == "NotFoundError: The device was disconnected.") {
                    this.logDebug("Ignored reset error");
                } else {
                    throw "Error during reset for manifestation: " + error;
                }
            }
        }
    }

}
