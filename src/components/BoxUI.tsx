import * as React from "react";
import { Popup } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import Box from "../core/Box";
import "./BoxUI.scss";
import { TResizeHandlerType, BoxEventMap, TRect, PatcherEventMap } from "../core/types";
import { BaseUI } from "../core/objects/BaseUI";

type P = { patcher: Patcher; id: string };
type S = { selected: boolean; rect: TRect; presentationRect: TRect; presentation: boolean; inPresentationMode: boolean; uiComponent: typeof BaseUI; editing: boolean; key: string };
export default class BoxUI extends React.PureComponent<P, S> {
    box = this.props.patcher.boxes[this.props.id];
    refDiv = React.createRef<HTMLDivElement>();
    handlingToggleEditOnClick = false;
    textChanged = false;
    dragging = false;
    dragged = false;
    state: S = {
        selected: false,
        rect: this.box.rect.slice() as TRect,
        presentationRect: this.box.presentationRect.slice() as TRect,
        presentation: this.box.presentation,
        inPresentationMode: this.props.patcher.state.presentation,
        uiComponent: this.box.uiComponent,
        editing: this.box.uiComponent.editableOnUnlock && this.box._editing,
        key: performance.now().toString()
    };
    handleResetPos = () => {
        const { box } = this;
        if (!box) return;
        let { rect, presentationRect } = box;
        rect = rect.slice() as TRect;
        presentationRect = presentationRect.slice() as TRect;
        this.setState({ rect, presentationRect });
    };
    handleTextChanged = () => {
        const { box } = this;
        if (!box) return;
        this.textChanged = true;
        const { uiComponent, presentation, _editing } = box;
        let { rect, presentationRect } = box;
        rect = rect.slice() as TRect;
        presentationRect = presentationRect.slice() as TRect;
        const key = performance.now().toString();
        const editing = uiComponent.editableOnUnlock && _editing;
        this.setState({ rect, presentationRect, presentation, uiComponent, key, editing }, this.inspectRectChange);
    };
    handleRectChanged = () => this.setState({ rect: this.box.rect.slice() as TRect });
    handlePresentationRectChanged = () => this.setState({ presentationRect: this.box.presentationRect.slice() as TRect });
    handleBlur = () => {
        this.handlingToggleEditOnClick = false;
        this.setState({ editing: false }, this.inspectRectChange);
    };
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        if (e.button !== 0) return;
        const rectKey = this.state.inPresentationMode ? "presentationRect" : "rect";
        // Handle Draggable
        const handleDraggable = () => {
            this.dragged = false;
            this.dragging = true;
            const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
            const patcherRect = patcherDiv.getBoundingClientRect();
            let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            const lastPos = { x: e.pageX, y: e.pageY };
            let dragOffset = { x: 0, y: 0 };
            const origOffset = this.state[rectKey].slice(0, 2);
            const handleMouseMove = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                const movementX = e.pageX - lastPos.x;
                const movementY = e.pageY - lastPos.y;
                lastPos.x = e.pageX;
                lastPos.y = e.pageY;
                if (this.dragging && !this.state.editing && (movementX | movementY)) {
                    if (!this.dragged) this.dragged = true;
                    dragOffset.x += movementX;
                    dragOffset.y += movementY;
                    dragOffset = this.props.patcher.moveSelectedBox(dragOffset, this.props.id);
                }
                const x = e.pageX - patcherRect.left;
                const y = e.pageY - patcherRect.top;
                if (x < 10) patcherDiv.scrollLeft += x - 10;
                if (x > patcherRect.width - 10) patcherDiv.scrollLeft += x + 10 - patcherRect.width;
                if (y < 10) patcherDiv.scrollTop += y - 10;
                if (y > patcherRect.height - 10) patcherDiv.scrollTop += y + 10 - patcherRect.height;
            };
            const handlePatcherScroll = (e: UIEvent) => {
                const movementX = patcherDiv.scrollLeft - patcherPrevScroll.left;
                const movementY = patcherDiv.scrollTop - patcherPrevScroll.top;
                dragOffset.x += movementX;
                dragOffset.y += movementY;
                patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
                if (this.dragging && !this.state.editing && (movementX || movementY)) {
                    if (!this.dragged) this.dragged = true;
                    dragOffset = this.props.patcher.moveSelectedBox(dragOffset, this.props.id);
                }
            };
            const handleKey = (e: KeyboardEvent) => {
                e.stopPropagation();
                e.preventDefault();
            };
            const handleMouseUp = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                this.dragging = false;
                const curOffset = this.state[rectKey];
                const totalOffset = { x: curOffset[0] - origOffset[0], y: curOffset[1] - origOffset[1] };
                if (this.dragged) this.props.patcher.moveEnd(totalOffset);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                this.refDiv.current.removeEventListener("keydown", handleKey);
                this.refDiv.current.removeEventListener("keyup", handleKey);
                patcherDiv.removeEventListener("scroll", handlePatcherScroll);
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            this.refDiv.current.addEventListener("keydown", handleKey);
            this.refDiv.current.addEventListener("keyup", handleKey);
            patcherDiv.addEventListener("scroll", handlePatcherScroll);
        };
        // Handle select
        if (e.shiftKey) {
            if (this.state.selected) {
                this.props.patcher.deselect(this.props.id);
            } else {
                this.props.patcher.select(this.props.id);
                handleDraggable();
            }
        } else if (this.state.selected) {
            if (!this.state.editing && this.state.uiComponent.editableOnUnlock) this.handlingToggleEditOnClick = true; // Handle edit
            handleDraggable();
        } else {
            this.props.patcher.selectOnly(this.props.id);
            handleDraggable();
        }
        e.stopPropagation();
    };
    handleClick = (e: React.MouseEvent) => {
        if (this.handlingToggleEditOnClick && this.state.selected && !this.state.editing && !this.dragged) this.setState({ editing: true });
        e.stopPropagation();
    };
    handleKeyDown = (e: React.KeyboardEvent) => {
        if (this.props.patcher.state.locked) return;
        if (e.key === "Enter") {
            if (e.ctrlKey) {
                this.props.patcher.dockUI(this.box);
                e.preventDefault();
            } else if (this.state.editing) {
                this.refDiv.current.focus();
            } else if (this.state.uiComponent.editableOnUnlock) {
                e.preventDefault();
                this.setState({ editing: !this.state.editing });
            }
        }
    };
    /**
     * if calculated width and height is different from expected, update rect
     *
     * @memberof BoxUI
     */
    inspectRectChange = () => {
        if (!this.refDiv.current) return;
        if (this.textChanged) {
            this.textChanged = false;
            return;
        }
        const div = this.refDiv.current;
        const divRect = div.getBoundingClientRect();
        const box = this.props.patcher.boxes[this.props.id];
        const rectKey = this.state.inPresentationMode ? "presentationRect" : "rect";
        if (divRect.width === box[rectKey][2] && divRect.height === box[rectKey][3]) return;
        const rect = [box[rectKey][0], box[rectKey][1], divRect.width, divRect.height] as TRect;
        if (this.state.inPresentationMode) {
            this.setState({ presentationRect: rect });
            box.setPresentationRect(rect.slice() as TRect);
        } else {
            this.setState({ rect });
            box.setRect(rect.slice() as TRect);
        }
    };
    handleSelected = (ids: string[]) => (ids.indexOf(this.props.id) >= 0 ? this.setState({ selected: true }) : null);
    handleDeselected = (ids: string[]) => (ids.indexOf(this.props.id) >= 0 ? this.setState({ selected: false }) : null);
    handlePatcherPresentationChanged = (inPresentationMode: boolean) => this.setState({ inPresentationMode });
    handlePresentationChanged = () => this.setState({ presentation: this.box.presentation, presentationRect: this.box.presentationRect.slice() as TRect });
    handleResized = ({ selected }: PatcherEventMap["resized"]) => {
        if (selected.indexOf(this.props.id) !== -1) this.inspectRectChange();
    };
    handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.props.patcher.state.locked) return;
        const classList = e.currentTarget.classList;
        const typeMap: { [key: string]: TResizeHandlerType } = {
            "resize-handler-n": "n",
            "resize-handler-ne": "ne",
            "resize-handler-e": "e",
            "resize-handler-se": "se",
            "resize-handler-s": "s",
            "resize-handler-sw": "sw",
            "resize-handler-w": "w",
            "resize-handler-nw": "nw"
        };
        let type: TResizeHandlerType;
        for (const key in typeMap) {
            if (classList.contains(key)) {
                type = typeMap[key];
            }
        }
        // Handle Draggable
        this.dragged = false;
        this.dragging = true;
        const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
        const patcherRect = patcherDiv.getBoundingClientRect();
        let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
        const lastPos = { x: e.pageX, y: e.pageY };
        let dragOffset = { x: 0, y: 0 };
        const totalOffset = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const movementX = e.pageX - lastPos.x;
            const movementY = e.pageY - lastPos.y;
            lastPos.x = e.pageX;
            lastPos.y = e.pageY;
            if (this.dragging && (movementX || movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset.x += movementX;
                dragOffset.y += movementY;
                dragOffset = this.props.patcher.resizeSelectedBox(this.props.id, dragOffset, type);
                totalOffset.x += movementX;
                totalOffset.y += movementY;
            }
            const x = e.pageX - patcherRect.left;
            const y = e.pageY - patcherRect.top;
            if (x < 10) patcherDiv.scrollLeft += x - 10;
            if (x > patcherRect.width - 10) patcherDiv.scrollLeft += x + 10 - patcherRect.width;
            if (y < 10) patcherDiv.scrollTop += y - 10;
            if (y > patcherRect.height - 10) patcherDiv.scrollTop += y + 10 - patcherRect.height;
        };
        const handlePatcherScroll = (e: UIEvent) => {
            const movementX = patcherDiv.scrollLeft - patcherPrevScroll.left;
            const movementY = patcherDiv.scrollTop - patcherPrevScroll.top;
            dragOffset.x += movementX;
            dragOffset.y += movementY;
            patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            if (this.dragging && !this.state.editing && (movementX || movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset = this.props.patcher.resizeSelectedBox(this.props.id, dragOffset, type);
            }
            totalOffset.x += movementX;
            totalOffset.y += movementY;
        };
        const handleKey = (e: KeyboardEvent) => {
            e.stopPropagation();
            e.preventDefault();
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.dragging = false;
            totalOffset.x -= dragOffset.x;
            totalOffset.y -= dragOffset.y;
            if (this.dragged) this.props.patcher.resizeEnd(totalOffset, type);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            this.refDiv.current.removeEventListener("keydown", handleKey);
            this.refDiv.current.removeEventListener("keyup", handleKey);
            patcherDiv.removeEventListener("scroll", handlePatcherScroll);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        this.refDiv.current.addEventListener("keydown", handleKey);
        this.refDiv.current.addEventListener("keyup", handleKey);
        patcherDiv.addEventListener("scroll", handlePatcherScroll);
        e.stopPropagation();
    };
    componentDidMount() {
        const { box } = this;
        this.setState({ selected: this.props.patcher.state.selected.indexOf(box.id) !== -1 });
        box.on("textChanged", this.handleTextChanged);
        box.on("rectChanged", this.handleRectChanged);
        box.on("presentationRectChanged", this.handlePresentationRectChanged);
        box.on("presentationChanged", this.handlePresentationChanged);
        this.props.patcher.on("selected", this.handleSelected);
        this.props.patcher.on("deselected", this.handleDeselected);
        this.props.patcher.on("presentation", this.handlePatcherPresentationChanged);
        this.props.patcher.on("resized", this.handleResized);
        this.inspectRectChange();
    }
    componentWillUnmount() {
        this.props.patcher.deselect(this.props.id);
        this.props.patcher.off("selected", this.handleSelected);
        this.props.patcher.off("deselected", this.handleDeselected);
        this.props.patcher.off("presentation", this.handlePatcherPresentationChanged);
        this.props.patcher.off("resized", this.handleResized);
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return;
        box.off("textChanged", this.handleTextChanged);
        box.off("rectChanged", this.handleRectChanged);
        box.off("presentationRectChanged", this.handlePresentationRectChanged);
        box.off("presentationChanged", this.handlePresentationChanged);
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.box.object.error(error);
        this.box.object.error(errorInfo.componentStack);
        console.error(error); // eslint-disable-line no-console
        console.error(errorInfo.componentStack); // eslint-disable-line no-console
    }
    render() {
        const { box } = this;
        const rect = this.state.inPresentationMode ? this.state.presentationRect : this.state.rect;
        const InnerUI = this.state.uiComponent;
        const divStyle = {
            left: rect[0],
            top: rect[1],
            width: InnerUI.sizing === "vertical" ? undefined : rect[2],
            height: InnerUI.sizing === "horizontal" ? undefined : rect[3]
        };
        const classArray = ["box", "box-default"];
        if (this.state.selected) classArray.push("selected");
        if (this.state.presentation) classArray.push("presentation");
        return (
            <div className={classArray.join(" ")} tabIndex={0} style={divStyle} ref={this.refDiv} onClick={this.handleClick} onMouseDown={this.handleMouseDown} onKeyDown={this.handleKeyDown}>
                {
                    this.state.inPresentationMode ? undefined : <>
                        <Inlets patcher={this.props.patcher} box={box} />
                        <Outlets patcher={this.props.patcher} box={box} />
                    </>
                }
                <div className={"resize-handlers resize-handlers-" + InnerUI.sizing}>
                    <div className="resize-handler resize-handler-n" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-s" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-ne" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-se" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-sw" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-nw" onMouseDown={this.handleResizeMouseDown}></div>
                </div>
                <div className="box-ui">
                    <InnerUI object={box.object} editing={this.state.editing} onEditEnd={this.handleBlur} key={this.state.key} />
                </div>
            </div>
        );
    }
}
class Inlets extends React.PureComponent<{ patcher: Patcher; box: Box }, { ports: JSX.Element[] }> {
    get ports() {
        const ports: JSX.Element[] = [];
        for (let i = 0; i < this.props.box.inlets; i++) {
            ports.push(<Inlet {...this.props} index={i} key={i} />);
        }
        return ports;
    }
    state = { ports: this.ports };
    componentDidMount() {
        this.props.box.on("textChanged", this.handleUpdate);
        this.props.box.on("ioCountChanged", this.handleUpdate);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("textChanged", this.handleUpdate);
        this.props.box.off("ioCountChanged", this.handleUpdate);
    }
    handleUpdate = () => {
        this.setState({ ports: this.ports });
    };
    render() {
        return (
            <div className="box-inlets box-ports">
                {this.state.ports}
            </div>
        );
    }
}
class Outlets extends React.PureComponent<{ patcher: Patcher; box: Box }, { ports: JSX.Element[] }> {
    get ports() {
        const ports: JSX.Element[] = [];
        for (let i = 0; i < this.props.box.outlets; i++) {
            ports.push(<Outlet {...this.props} index={i} key={i} />);
        }
        return ports;
    }
    state = { ports: this.ports };
    componentDidMount() {
        this.props.box.on("textChanged", this.handleUpdate);
        this.props.box.on("ioCountChanged", this.handleUpdate);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("textChanged", this.handleUpdate);
        this.props.box.off("ioCountChanged", this.handleUpdate);
    }
    handleUpdate = () => {
        this.setState({ ports: this.ports });
    };
    render() {
        return (
            <div className="box-outlets box-ports">
                {this.ports}
            </div>
        );
    }
}
class Inlet extends React.PureComponent<{ patcher: Patcher; box: Box; index: number }, { isConnected: boolean; highlight: boolean }> {
    state = { isConnected: this.props.box.inletLines[this.props.index].size > 0, highlight: false };
    dragged = false;
    componentDidMount() {
        this.props.box.on("highlightPort", this.handleHighlight);
        this.props.box.on("connectedPort", this.handleConnectedChange);
        this.props.box.on("disconnectedPort", this.handleConnectedChange);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("highlightPort", this.handleHighlight);
        this.props.box.off("connectedPort", this.handleConnectedChange);
        this.props.box.off("disconnectedPort", this.handleConnectedChange);
    }
    handleHighlight = (e: BoxEventMap["highlightPort"]) => {
        const { isSrc, i, highlight } = e;
        if (!isSrc && i === this.props.index && highlight !== this.state.highlight) this.setState({ highlight });
    };
    handleConnectedChange = (e: BoxEventMap["disconnectedPort" | "connectedPort"]) => {
        const { isSrc, i, last } = e;
        if (!isSrc && i === this.props.index) this.setState({ isConnected: !last });
    };
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        if (e.button !== 0) return;
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        this.props.patcher.tempLine(true, [this.props.box.id, this.props.index]);
    };
    handleMouseEnter = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        if (e.buttons) return;
        this.setState({ highlight: true });
    };
    handleMouseMove = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        if (e.currentTarget !== e.target) this.setState({ highlight: false });
    };
    handleMouseLeave = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        this.setState({ highlight: false });
    };
    render() {
        const { box, index: i, patcher } = this.props;
        const forceHot = patcher.props.mode === "gen" || patcher.props.mode === "faust";
        let props = { isHot: false, type: "anything", description: "" };
        const meta = box.meta.inlets;
        if (meta && meta.length) props = { ...props, ...(i >= meta.length ? (meta[meta.length - 1].varLength ? { ...meta[meta.length - 1], isHot: false } : {}) : meta[i]) };
        const className = "box-port box-inlet" + (props.isHot || forceHot ? " box-inlet-hot" : " box-inlet-cold") + (this.state.isConnected ? " box-port-connected" : "") + (this.state.highlight ? " box-port-highlight" : "");
        return (
            <div className={className} onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
                <Popup
                    trigger={<div style={{ pointerEvents: "none" }} />}
                    content={<>{props.description.length ? <span>{props.description}: </span> : undefined}<span style={{ color: "#30a0a0" }}>{props.type}</span></>}
                    position="top center"
                    open={this.state.highlight}
                    size="mini"
                    inverted
                />
            </div>
        );
    }
}
class Outlet extends React.PureComponent< { patcher: Patcher; box: Box; index: number }, { isConnected: boolean; highlight: boolean }> {
    state = { isConnected: this.props.box.outletLines[this.props.index].size > 0, highlight: false };
    dragged = false;
    componentDidMount() {
        this.props.box.on("highlightPort", this.handleHighlight);
        this.props.box.on("connectedPort", this.handleConnectedChange);
        this.props.box.on("disconnectedPort", this.handleConnectedChange);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("highlightPort", this.handleHighlight);
        this.props.box.off("connectedPort", this.handleConnectedChange);
        this.props.box.off("disconnectedPort", this.handleConnectedChange);
    }
    handleHighlight = (e: BoxEventMap["highlightPort"]) => {
        const { isSrc, i, highlight } = e;
        if (isSrc && i === this.props.index && highlight !== this.state.highlight) this.setState({ highlight });
    };
    handleConnectedChange = (e: BoxEventMap["disconnectedPort" | "connectedPort"]) => {
        const { isSrc, i, last } = e;
        if (isSrc && i === this.props.index) this.setState({ isConnected: !last });
    };
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        if (e.button !== 0) return;
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        this.props.patcher.tempLine(false, [this.props.box.id, this.props.index]);
    };
    handleMouseEnter = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        if (e.buttons) return;
        this.setState({ highlight: true });
    };
    handleMouseLeave = () => {
        if (this.props.patcher.state.locked) return;
        this.setState({ highlight: false });
    };
    handleMouseMove = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        if (e.currentTarget !== e.target) this.setState({ highlight: false });
    };
    render() {
        const box = this.props.box;
        const i = this.props.index;
        let props = { type: "anything", description: "" };
        const meta = box.meta.outlets;
        if (meta && meta.length) props = { ...props, ...(i >= meta.length ? (meta[meta.length - 1].varLength ? meta[meta.length - 1] : {}) : meta[i]) };
        const className = "box-port box-outlet" + (this.state.isConnected ? " box-port-connected" : "") + (this.state.highlight ? " box-port-highlight" : "");
        return (
            <div className={className} onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
                <Popup
                    trigger={<div />}
                    content={<>{props.description.length ? <span>{props.description}: </span> : undefined}<span style={{ color: "#30a0a0" }}>{props.type}</span></>}
                    position="bottom center"
                    open={this.state.highlight}
                    size="mini"
                    inverted
                    offset="0px, 5px"
                />
            </div>
        );
    }
}
