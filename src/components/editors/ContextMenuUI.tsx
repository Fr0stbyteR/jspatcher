import * as React from "react";
import { Divider, Menu, Popup } from "semantic-ui-react";
import Env from "../../core/Env";
import PatcherEditor from "../../core/patcher/PatcherEditor";
// import HardwareEditor from "../../core/hardware/HardwareEditor";

// By @CorvusPrudens

const createContextFromEvent = (e: MouseEvent) => {
    class ContextMenuUIContext extends HTMLElement {
        getBoundingClientRect() {
            const left = e.clientX;
            const top = e.clientY;
            const right = left + 1;
            const bottom = top - 1;
            return {
                left,
                top,
                right,
                bottom,
                height: 0,
                width: 0,
                x: left,
                y: top,
                toJSON: () => {}
            };
        }
    }
    if (e.target instanceof HTMLElement) {
        Object.setPrototypeOf(e.target, ContextMenuUIContext.prototype);
    }
    return e.target as ContextMenuUIContext;
};

interface P {
    env: Env;
    lang: string;
    editor: PatcherEditor;// | HardwareEditor;
    runtime?: boolean;
    children?: JSX.Element[];
}

interface S {
    open: boolean;
    selection: string[];
    clipboardEmpty: boolean;
    enableAddPres: boolean;
    enableRemovePres: boolean;
    singleSelection: string | undefined;
    help: string[];
    reference: string | undefined;
    dockable: boolean;
}

export default class ContextMenuUI extends React.PureComponent<P, S> {
    state = {
        open: false,
        selection: [] as string[],
        clipboardEmpty: true,
        enableAddPres: false,
        enableRemovePres: false,
        singleSelection: undefined as string,
        reference: undefined as string | undefined,
        help: [] as string[],
        dockable: false
    };

    contextRef: React.MutableRefObject<HTMLElement> = React.createRef();
    handleCut = async () => {
        this.setState({ open: false });
        await this.props.editor.cut();
    };
    handleCopy = async () => {
        this.setState({ open: false });
        await this.props.editor.copy();
    };
    handlePaste = async () => {
        this.setState({ open: false });
        await this.props.editor.paste();
    };
    handleAddToPres = () => {
        this.setState({ open: false });
        for (const id of this.state.selection) {
            const obj = this.props.editor.boxes[id];
            if (obj) {
                obj.setPresentation(true);
            }
        }
    };
    handleRemoveFromPres = () => {
        this.setState({ open: false });
        for (const id of this.state.selection) {
            const obj = this.props.editor.boxes[id];
            if (obj) {
                obj.setPresentation(false);
            }
        }
    };
    /*
    handleOpenHelp = () => {
        this.setState({ open: false });
        if (this.props.editor instanceof PatcherEditor) this.props.editor.emit("help");
        else this.props.editor.emit("help");
    };
    handleOpenReference = () => {
        this.setState({ open: false });
        if (this.props.editor instanceof PatcherEditor) this.props.editor.emit("reference");
        else this.props.editor.emit("reference");
    };
    */
    handleBringToFront = () => {
        this.setState({ open: false });
        this.props.editor.bringToFront();
    };
    handleSendToBack = () => {
        this.setState({ open: false });
        this.props.editor.sendToBack();
    };
    handleContextDockable = () => {
        this.setState({ open: false });
        this.props.editor.dockUI();
    };
    handleInspector = () => {
        this.setState({ open: false });
        if (this.props.editor instanceof PatcherEditor) this.props.editor.emit("inspector");
        // else this.props.editor.emit("inspector");
    };
    render() {
        return (
            <>
                <div onContextMenu={async (e) => {
                    e.preventDefault();

                    const clipboardEmpty = !(await navigator.clipboard.readText());
                    const selection = this.props.editor.state.selected;

                    let enableAddPres = false;
                    let enableRemovePres = false;

                    for (const id of selection) {
                        const obj = this.props.editor.boxes[id];
                        if (obj) {
                            if (obj.presentation) {
                                enableRemovePres = true;
                            } else {
                                enableAddPres = true;
                            }
                        }
                    }

                    const help: string[] = [];
                    let reference: string;
                    let singleSelection: string;
                    let dockable = false;
                    if (selection.length === 1) {
                        const obj = this.props.editor.boxes[selection[0]];
                        if (obj) {
                            // help = obj.meta.helpFiles || [];
                            // reference = obj.meta.docs;
                            singleSelection = obj.text.split(" ")[0] || obj.text;
                            dockable = obj.UI.dockable;
                        }
                    }

                    this.contextRef.current = createContextFromEvent(e.nativeEvent);
                    this.setState({ open: true, selection, clipboardEmpty, enableAddPres, enableRemovePres, help, reference, singleSelection, dockable });
                }}>
                    {this.props.children}
                </div>

                <Popup
                    basic
                    closeOnEscape
                    closeOnTriggerBlur
                    closeOnTriggerClick
                    context={this.contextRef}
                    onClose={() => this.setState({ open: false })}
                    open={this.state.open}
                    popperDependencies={[this.contextRef]}
                    inverted
                    style={{ marginBottom: "0px", marginTop: "0px", paddingTop: "2px", paddingBottom: "2px" }}
                    position="bottom left"
                    positionFixed
                >
                    <Menu
                        vertical
                        inverted
                        text
                    >
                        {(this.props.editor instanceof PatcherEditor) && this.state.selection.length === 0 ? <>
                            {!this.props.editor.isLocked
                                ? <>
                                    <Menu.Item key="edit" content="Lock" icon="lock" onClick={() => { this.setState({ open: false }); this.props.editor.setState({ locked: true }); }} />
                                    <Divider />
                                </>
                                : <Menu.Item key="edit" content="Unlock" icon="lock open" onClick={() => { this.setState({ open: false }); this.props.editor.setState({ locked: false }); }} />}

                        </> : undefined}

                        {this.props.editor.isLocked ? undefined : <>
                            {this.state.singleSelection ? <>
                                {/* <Menu.Item key="help" content={`Open ${this.state.singleSelection} Help`} icon="help" onClick={this.handleOpenHelp} disabled={this.state.help.length === 0} />
                                <Menu.Item key="reference" content={`Open ${this.state.singleSelection} Reference`} icon="book" onClick={this.handleOpenReference} disabled={!(this.state.reference)} /> */}
                                <Menu.Item key="dock" content="Open in dock" icon="edit" onClick={this.handleContextDockable} disabled={!this.state.dockable} />
                                <Divider />
                            </> : undefined}
                            <Menu.Item key="cut" content="Cut" icon="cut" onClick={this.handleCut} disabled={this.state.selection.length === 0} />
                            <Menu.Item key="copy" content="Copy" icon="copy" onClick={this.handleCopy} disabled={this.state.selection.length === 0} />
                            <Menu.Item key="paste" content="Paste" icon="paste" onClick={this.handlePaste} disabled={this.state.clipboardEmpty} />
                            <Menu.Item key="delete" content="Delete" icon="trash" onClick={() => { this.setState({ open: false }); this.props.editor.deleteSelected(); }} disabled={this.state.selection.length === 0} />
                            {this.state.selection.length === 0 ? undefined : <>
                                <Divider />
                                <Menu.Item key="inspector" content="Inspector" icon="info" onClick={this.handleInspector} />
                                <Menu.Item key="bringtofront" content="Bring to front" icon="angle double up" onClick={this.handleBringToFront} />
                                <Menu.Item key="sendtoback" content="Send to back" icon="angle double down" onClick={this.handleSendToBack} />
                                {this.props.editor instanceof PatcherEditor ? <>
                                    <Menu.Item key="presadd" content="Add to presentation" icon="video camera" onClick={this.handleAddToPres} disabled={!this.state.enableAddPres} />
                                    <Menu.Item key="presremove" content="Remove from presentation" icon="video camera" onClick={this.handleRemoveFromPres} disabled={!this.state.enableRemovePres} />
                                </> : undefined}
                            </>}
                        </>}
                    </Menu>
                </Popup>
            </>
        );
    }
}
