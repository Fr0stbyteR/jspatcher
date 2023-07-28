import { dfu } from "./dfu";

export function hex4(n: number) {
    let s = n.toString(16)
    while (s.length < 4) {
        s = '0' + s;
    }
    return s;
}

export function hexAddr8(n: number) {
    let s = n.toString(16)
    while (s.length < 8) {
        s = '0' + s;
    }
    return "0x" + s;
}

export function niceSize(n: number) {
    const gigabyte = 1024 * 1024 * 1024;
    const megabyte = 1024 * 1024;
    const kilobyte = 1024;
    if (n >= gigabyte) {
        return n / gigabyte + "GiB";
    } else if (n >= megabyte) {
        return n / megabyte + "MiB";
    } else if (n >= kilobyte) {
        return n / kilobyte + "KiB";
    } else {
        return n + "B";
    }
}

export function formatDFUSummary(device: dfu.Device) {
    const vid = hex4(device.device_.vendorId);
    const pid = hex4(device.device_.productId);
    const name = device.device_.productName;

    let mode = "Unknown"
    if (device.settings.alternate.interfaceProtocol == 0x01) {
        mode = "Runtime";
    } else if (device.settings.alternate.interfaceProtocol == 0x02) {
        mode = "DFU";
    }

    const cfg = device.settings.configuration.configurationValue;
    const intf = device.settings["interface"].interfaceNumber;
    const alt = device.settings.alternate.alternateSetting;
    const serial = device.device_.serialNumber;
    let info = `${mode}: [${vid}:${pid}] cfg=${cfg}, intf=${intf}, alt=${alt}, name="${name}" serial="${serial}"`;
    return info;
}

export function formatDFUInterfaceAlternate(settings: dfu.Settings) {
    let mode = "Unknown"
    if (settings.alternate.interfaceProtocol == 0x01) {
        mode = "Runtime";
    } else if (settings.alternate.interfaceProtocol == 0x02) {
        mode = "DFU";
    }

    const cfg = settings.configuration.configurationValue;
    const intf = settings["interface"].interfaceNumber;
    const alt = settings.alternate.alternateSetting;
    const name = (settings.name) ? settings.name : "UNKNOWN";

    return `${mode}: cfg=${cfg}, intf=${intf}, alt=${alt}, name="${name}"`;
}

export async function fixInterfaceNames(device_: USBDevice, interfaces: dfu.Settings[]) {
    // Check if any interface names were not read correctly
    if (interfaces.some(intf => (intf.name == null))) {
        // Manually retrieve the interface name string descriptors
        let tempDevice = new dfu.Device(device_, interfaces[0]);
        await tempDevice.device_.open();
        await tempDevice.device_.selectConfiguration(1);
        let mapping = await tempDevice.readInterfaceNames();
        await tempDevice.close();

        for (let intf of interfaces) {
            if (intf.name === null) {
                let configIndex = intf.configuration.configurationValue;
                let intfNumber = intf["interface"].interfaceNumber;
                let alt = intf.alternate.alternateSetting;
                intf.name = mapping[configIndex][intfNumber][alt];
            }
        }
    }
}

export function populateInterfaceList(form: any, device_: dfu.Device, interfaces: dfu.Settings[]) {
    let old_choices = Array.from(form.getElementsByTagName("div"));
    for (let radio_div of old_choices) {
        form.removeChild(radio_div);
    }

    let button = form.getElementsByTagName("button")[0];

    for (let i = 0; i < interfaces.length; i++) {
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "interfaceIndex";
        radio.value = i.toString();
        radio.id = "interface" + i;
        radio.required = true;

        let label = document.createElement("label");
        label.textContent = formatDFUInterfaceAlternate(interfaces[i]);
        label.className = "radio"
        label.setAttribute("for", "interface" + i);

        let div = document.createElement("div");
        div.appendChild(radio);
        div.appendChild(label);
        form.insertBefore(div, button);
    }
}

export function getDFUDescriptorProperties(device: dfu.Device): Promise<dfu.DFUProperties | void> {
    // Attempt to read the DFU functional descriptor
    // TODO: read the selected configuration's descriptor
    return device.readConfigurationDescriptor(0).then(
        data => {
            let configDesc = dfu.Device.parseConfigurationDescriptor(data);
            let funcDesc = null;
            let configValue = device.settings.configuration.configurationValue;
            if (configDesc.bConfigurationValue == configValue) {
                for (let desc of configDesc.descriptors) {
                    if (desc.bDescriptorType == 0x21 && desc.hasOwnProperty("bcdDFUVersion")) {
                        funcDesc = desc;
                        break;
                    }
                }
            }

            if (funcDesc) {
                return {
                    WillDetach: ((funcDesc.bmAttributes & 0x08) != 0),
                    ManifestationTolerant: ((funcDesc.bmAttributes & 0x04) != 0),
                    CanUpload: ((funcDesc.bmAttributes & 0x02) != 0),
                    CanDnload: ((funcDesc.bmAttributes & 0x01) != 0),
                    TransferSize: funcDesc.wTransferSize,
                    DetachTimeOut: funcDesc.wDetachTimeOut,
                    DFUVersion: funcDesc.bcdDFUVersion
                };
            } else {
                return null;
            }
        },
        error => { }
    );
}
