import * as React from "react";
import { Popup } from "semantic-ui-react";
import BaseUI from "../../../core/hardware/objects/base/BaseHardwareUI";
import { isRectMovable, isRectResizable } from "../../../utils/utils";
import type PatcherEditor from "../../../core/hardware/HardwareEditor";
import type { PatcherEditorEventMap } from "../../../core/hardware/HardwareEditor";
import type Box from "../../../core/hardware/Box";
import type { BoxEventMap } from "../../../core/hardware/Box";
import type { TResizeHandlerType, TRect, TPresentationRect } from "../../../core/types";
import type AbstractUI from "../../../core/hardware/objects/base/AbstractHardwareUI";
import "./BoxUI.scss";
import { compatiblePins } from "../../../core/hardware/Compatibility";

interface P {
    editor: PatcherEditor;
    id: string;
    runtime?: boolean;
    scrollIntoView?: boolean;
}

interface S {
    selected: boolean;
    rect: TRect;
    presentationRect: TPresentationRect;
    presentation: boolean;
    inPresentationMode: boolean;
    InnerUI: typeof AbstractUI;
    editing: boolean;
    error: boolean;
    highlight: boolean;
    highlightInlet: number;
    highlightOutlet: number;
    key: string;
    bubblePorts: number[];
    textChanged: boolean;
}
export default class BoxUI extends React.PureComponent<P, S> {
    box = this.props.editor.boxes[this.props.id];
    refDiv = React.createRef<HTMLDivElement>();
    handlingToggleEditOnClick = false;
    textChanged = false;
    dragging = false;
    dragged = false;
    state: S = {
        selected: false,
        rect: this.box.rect.slice() as TRect,
        presentationRect: this.box.presentationRect.slice() as TPresentationRect,
        presentation: this.box.presentation,
        inPresentationMode: this.props.editor.state.presentation,
        InnerUI: this.box.UI || BaseUI,
        editing: (this.box.UI || BaseUI).editableOnUnlock && this.box._editing,
        error: false,
        highlight: false,
        highlightInlet: null,
        highlightOutlet: null,
        key: performance.now().toString(),
        bubblePorts: [],
        textChanged: false,
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
        const { presentation, _editing } = box;
        const InnerUI = box.UI || BaseUI;
        let { rect, presentationRect } = box;
        rect = rect.slice() as TRect;
        presentationRect = presentationRect.slice() as TRect;
        const key = performance.now().toString();
        const editing = InnerUI.editableOnUnlock && _editing;
        this.setState({ rect, presentationRect, presentation, InnerUI, key, editing }, this.inspectRectChange);
    };
    handleRectChanged = () => this.setState({ rect: this.box.rect.slice() as TRect });
    handlePresentationRectChanged = () => this.setState({ presentationRect: this.box.presentationRect.slice() as TPresentationRect });
    handleBlur = () => {
        this.handlingToggleEditOnClick = false;
        this.inspectRectChange();
        this.setState({ editing: false, textChanged: false }, this.inspectRectChange);
    };
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;

        if (e.button === 2) {
            if (this.props.editor.state.selected.length <= 1) {
                this.props.editor.selectOnly(this.props.id);
            }
            return;
        }

        if (e.button !== 0) return;

        const rectKey = this.state.inPresentationMode ? "presentationRect" : "rect";
        // Handle Draggable
        const handleDraggable = () => {
            if (!isRectMovable(this.state[rectKey])) return;
            this.dragged = false;
            this.dragging = true;
            const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
            const patcherRect = patcherDiv.getBoundingClientRect();
            let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            const lastPos = { x: e.clientX, y: e.clientY };
            let dragOffset = { x: 0, y: 0 };
            const handleMouseMove = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                const movementX = e.clientX - lastPos.x;
                const movementY = e.clientY - lastPos.y;
                lastPos.x = e.clientX;
                lastPos.y = e.clientY;
                if (this.dragging && !this.state.editing && (movementX | movementY)) {
                    if (!this.dragged) this.dragged = true;
                    dragOffset.x += movementX;
                    dragOffset.y += movementY;
                    dragOffset = this.props.editor.moveSelectedBox(dragOffset, this.props.id);
                }
                const x = e.clientX - patcherRect.left;
                const y = e.clientY - patcherRect.top;
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
                    dragOffset = this.props.editor.moveSelectedBox(dragOffset, this.props.id);
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
                if (this.dragged) this.props.editor.moveEnd(this.props.editor.state.selected, { ...this.translate });
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
                this.props.editor.deselect(this.props.id);
            } else {
                this.props.editor.select(this.props.id);
                handleDraggable();
            }
        } else if (this.state.selected) {
            if (!this.state.editing && this.state.InnerUI.editableOnUnlock) this.handlingToggleEditOnClick = true; // Handle edit
            handleDraggable();
        } else {
            this.props.editor.selectOnly(this.props.id);
            handleDraggable();
        }
        e.stopPropagation();
    };
    handleClick = (e: React.MouseEvent) => {
        if (this.handlingToggleEditOnClick && this.state.selected && !this.state.editing && !this.dragged) this.setState({ editing: true });
        e.stopPropagation();
    };
    handleKeyDown = (e: React.KeyboardEvent) => {
        if (this.props.editor.state.locked) return;
        if (e.key === "Enter") {
            if (e.ctrlKey) {
                this.props.editor.dockUI(this.box);
                e.preventDefault();
            } else if (this.state.editing) {
                this.refDiv.current.focus();
            } else if (this.state.InnerUI.editableOnUnlock) {
                e.preventDefault();
                this.setState({ editing: !this.state.editing });
            }
        }
    };
    /**
     * if calculated width and height is different from expected, update rect
     */
    inspectRectChange = () => {
        if (!this.refDiv.current) return;
        // if (this.textChanged) {
        //     this.textChanged = false;
        //     return;
        // }
        const box = this.props.editor.boxes[this.props.id];
        const rectKey = this.state.inPresentationMode ? "presentationRect" : "rect";
        if (!isRectResizable(box[rectKey])) return;
        const div = this.refDiv.current;
        if (div.offsetParent === null) return;
        const divRect = div.getBoundingClientRect();

        // In the case where the box is too small, set the minimum size
        if (divRect.width < box.minWidth() /* || divRect.height < box.minHeight() */) {
            const rect = [box[rectKey][0], box[rectKey][1], box.minWidth(), divRect.height] as TRect;
            if (this.state.inPresentationMode) {
                this.setState({ presentationRect: rect });
                box.setPresentationRect(rect.slice() as TRect);
            } else {
                this.setState({ rect });
                box.setRect(rect.slice() as TRect);
            }
            return;
        }

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
    handleSelected = (ids: string[]) => {
        const selected = !this.props.runtime && ids.indexOf(this.props.id) >= 0;
        if (this.state.selected !== selected) {
            if (!selected) this.handlingToggleEditOnClick = false;
            this.setState({ selected });
        }
    };
    handlePatcherPresentationChanged = (inPresentationMode: boolean) => this.setState({ inPresentationMode });
    handlePresentationChanged = () => this.setState({ presentation: this.box.presentation, presentationRect: this.box.presentationRect.slice() as TRect });
    translate = { x: 0, y: 0 };
    handleMoving = ({ selected, delta, presentation }: PatcherEditorEventMap["moving"]) => {
        if (!this.refDiv.current) return;
        if (this.props.editor.state.presentation !== presentation) return;
        if (this.props.editor.state.presentation && !this.state.presentation) return;
        if (selected.indexOf(this.props.id) !== -1) {
            this.translate.x += delta.x;
            this.translate.y += delta.y;
            this.refDiv.current.style.transform = `translate(${this.translate.x}px, ${this.translate.y}px)`;
        }
    };
    handleMoved = ({ selected, presentation }: PatcherEditorEventMap["moved"]) => {
        if (!this.refDiv.current) return;
        if (selected.indexOf(this.props.id) !== -1) {
            this.translate.x = 0;
            this.translate.y = 0;
            this.refDiv.current.style.transform = "";
            if (presentation) this.handlePresentationRectChanged();
            else this.handleRectChanged();
        }
    };
    handleResized = ({ selected }: PatcherEditorEventMap["resized"]) => {
        if (selected.indexOf(this.props.id) !== -1) this.inspectRectChange();
    };
    clearOverlay = () => {
        this.setState({ highlight: false, error: false });
        document.removeEventListener("mousedown", this.clearOverlay);
    };
    handleHighlight = (boxId: string) => {
        const highlight = boxId === this.box.id;
        document.removeEventListener("mousedown", this.clearOverlay);
        this.setState({ highlight });
        if (!highlight) return;
        if (!this.refDiv.current) return;
        const div = this.refDiv.current;
        const patcherDiv = div.parentElement.parentElement;
        if (div.offsetTop < patcherDiv.scrollTop
            || div.offsetLeft < patcherDiv.scrollLeft
            || div.offsetTop + div.offsetHeight < patcherDiv.scrollTop + patcherDiv.offsetHeight
            || div.offsetLeft + div.offsetWidth < patcherDiv.scrollLeft + patcherDiv.offsetWidth
        ) div.scrollIntoView({ block: "nearest", inline: "nearest" });
        document.addEventListener("mousedown", this.clearOverlay);
    };
    handleError = () => {
        document.removeEventListener("mousedown", this.clearOverlay);
        this.setState({ error: true });
        document.addEventListener("mousedown", this.clearOverlay);
    };
    handleHighlightPort = (highlightPort: PatcherEditorEventMap["highlightPort"]) => {
        if (!highlightPort || highlightPort.boxId !== this.box.id) {
            if (this.state.highlightInlet === null && this.state.highlightOutlet === null) return;
            this.setState({ highlightInlet: null, highlightOutlet: null });
            return;
        }
        const { isSrc, i } = highlightPort;
        if (isSrc && this.state.highlightOutlet !== i) this.setState({ highlightOutlet: i });
        else if (!isSrc && this.state.highlightInlet !== i) this.setState({ highlightInlet: i });
    };
    handleBubblePorts = (bubblePorts: PatcherEditorEventMap["bubblePorts"]) => {
        if (!bubblePorts) {
            this.setState({ bubblePorts: [] });
            return;
        }

        const { boxId, i: otherIndex } = bubblePorts;

        const compatible = this.box.ios.map((io, i) =>
            ({ index: i, compatible: this.props.editor.getPortsCompatible(boxId, otherIndex, this.box.id, i) })
        )
            .filter(({ compatible }) => compatible)
            .map(({ index }) => index);

        this.setState({ bubblePorts: compatible });

    };
    handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;
        const rectKey = this.state.inPresentationMode ? "presentationRect" : "rect";
        if (!isRectResizable(this.state[rectKey])) return;
        const classList = e.currentTarget.classList;
        const typeMap: Record<string, TResizeHandlerType> = {
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
        const lastPos = { x: e.clientX, y: e.clientY };
        let dragOffset = { x: 0, y: 0 };
        const totalOffset = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const movementX = e.clientX - lastPos.x;
            const movementY = e.clientY - lastPos.y;
            lastPos.x = e.clientX;
            lastPos.y = e.clientY;
            if (this.dragging && (movementX || movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset.x += movementX;
                dragOffset.y += movementY;
                dragOffset = this.props.editor.resizeSelectedBox(this.props.id, dragOffset, type);
                totalOffset.x += movementX;
                totalOffset.y += movementY;
            }
            const x = e.clientX - patcherRect.left;
            const y = e.clientY - patcherRect.top;
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
                dragOffset = this.props.editor.resizeSelectedBox(this.props.id, dragOffset, type);
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
            if (this.dragged) this.props.editor.resizeEnd(this.props.editor.state.selected, totalOffset, type);
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
        const { editor } = this.props;
        const { box } = this;
        this.setState({ selected: this.props.editor.state.selected.indexOf(box.id) !== -1 });
        box.on("textChanged", this.handleTextChanged);
        box.on("rectChanged", this.handleRectChanged);
        box.on("presentationRectChanged", this.handlePresentationRectChanged);
        box.on("presentationChanged", this.handlePresentationChanged);
        box.on("error", this.handleError);
        editor.on("selected", this.handleSelected);
        editor.on("presentation", this.handlePatcherPresentationChanged);
        editor.on("moving", this.handleMoving);
        editor.on("moved", this.handleMoved);
        editor.on("resized", this.handleResized);
        editor.on("highlightBox", this.handleHighlight);
        editor.on("highlightPort", this.handleHighlightPort);
        editor.on("bubblePorts", this.handleBubblePorts);
        this.inspectRectChange();
        if (this.props.scrollIntoView && this.refDiv.current) {
            const div = this.refDiv.current;
            const patcherDiv = div.parentElement.parentElement;
            if (div.offsetTop < patcherDiv.scrollTop
                || div.offsetLeft < patcherDiv.scrollLeft
                || div.offsetTop + div.offsetHeight < patcherDiv.scrollTop + patcherDiv.offsetHeight
                || div.offsetLeft + div.offsetWidth < patcherDiv.scrollLeft + patcherDiv.offsetWidth
            ) div.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
    }
    componentWillUnmount() {
        const { editor } = this.props;
        editor.deselect(this.props.id);
        editor.off("selected", this.handleSelected);
        editor.off("presentation", this.handlePatcherPresentationChanged);
        editor.off("resized", this.handleResized);
        editor.off("highlightBox", this.handleHighlight);
        editor.off("highlightPort", this.handleHighlightPort);
        editor.off("bubblePorts", this.handleBubblePorts);
        const box = this.props.editor.boxes[this.props.id];
        if (!box) return;
        box.off("textChanged", this.handleTextChanged);
        box.off("rectChanged", this.handleRectChanged);
        box.off("presentationRectChanged", this.handlePresentationRectChanged);
        box.off("presentationChanged", this.handlePresentationChanged);
        box.off("error", this.handleError);
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
        const InnerUI = this.state.InnerUI;
        const divStyle = {
            left: rect[0],
            top: rect[1],
            width: InnerUI.sizing === "vertical" ? undefined : this.state.editing && this.state.textChanged ? undefined : rect[2],
            height: InnerUI.sizing === "horizontal" ? undefined : rect[3],
            minWidth: '50px',
        };
        const classArray = ["box", "box-default"];
        if (this.state.selected) classArray.push("selected");
        if (this.state.presentation) classArray.push("presentation");
        return (
            <div className={classArray.join(" ")} tabIndex={0} style={divStyle} ref={this.refDiv} data-id={this.props.id} onClick={this.handleClick} onMouseDown={this.handleMouseDown} onKeyDown={this.handleKeyDown}>
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
                    <InnerUI object={box.object} editor={this.props.editor} editing={this.state.editing} onEditEnd={this.handleBlur} key={this.state.key} onContentsChanged={() => this.setState({ textChanged: true })} />
                </div>
                {
                    this.state.inPresentationMode ? undefined : <>
                        <Ios editor={this.props.editor} box={box} runtime={this.props.runtime} highlight={this.state.highlightInlet} bubble={this.state.bubblePorts} />
                        {/* //     <Inlets editor={this.props.editor} box={box} runtime={this.props.runtime} highlight={this.state.highlightInlet} />
                    //     <Outlets editor={this.props.editor} box={box} runtime={this.props.runtime} highlight={this.state.highlightOutlet} /> */}
                    </>
                }
                {
                    this.state.error || this.state.highlight ? <div style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, backgroundColor: this.state.error ? "rgba(255, 0, 0, 0.3)" : "rgba(255, 255, 128, 0.3)" }} /> : undefined
                }
            </div>
        );
    }
}
class Ios extends React.PureComponent<{ editor: PatcherEditor; box: Box; runtime?: boolean; highlight: number, bubble: number[] }, { key: number }> {
    state = { key: performance.now() };
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
        this.setState({ key: performance.now() });
    };
    render() {
        const withIndex = this.props.box.ios.map((value, i) => ({ ...value, index: i }));
        return (
            <>
                <div className="box-top box-h-ports">
                    {withIndex.filter(value => value.edge === 'T').map(({ position, index }) => <Io {...this.props} index={index} key={index} highlight={index === this.props.highlight} bubble={this.props.bubble.includes(index)} left={`${position * 100}%`} edge='top' port='h' />)}
                </div>
                <div className="box-bottom box-h-ports">
                    {withIndex.filter(value => value.edge === 'B').map(({ position, index }) => <Io {...this.props} index={index} key={index} highlight={index === this.props.highlight} bubble={this.props.bubble.includes(index)} left={`${position * 100}%`} edge='bottom' port='h' />)}
                </div>
                <div className="box-left box-v-ports">
                    {withIndex.filter(value => value.edge === 'L').map(({ position, index }) => <Io {...this.props} index={index} key={index} highlight={index === this.props.highlight} bubble={this.props.bubble.includes(index)} top={`${position * 100}%`} edge='left' port='v' />)}
                </div>
                <div className="box-right box-v-ports">
                    {withIndex.filter(value => value.edge === 'R').map(({ position, index }) => <Io {...this.props} index={index} key={index} highlight={index === this.props.highlight} bubble={this.props.bubble.includes(index)} top={`${position * 100}%`} edge='right' port='v' />)}
                </div>
            </>
        );
    }
}
// class Outlets extends React.PureComponent<{ editor: PatcherEditor; box: Box; runtime?: boolean; highlight: number }, { key: number }> {
//     state = { key: performance.now() };
//     componentDidMount() {
//         this.props.box.on("textChanged", this.handleUpdate);
//         this.props.box.on("ioCountChanged", this.handleUpdate);
//     }
//     componentWillUnmount() {
//         if (!this.props.box) return;
//         this.props.box.off("textChanged", this.handleUpdate);
//         this.props.box.off("ioCountChanged", this.handleUpdate);
//     }
//     handleUpdate = () => {
//         this.setState({ key: performance.now() });
//     };
//     render() {
//         return (
//             <div className="box-outlets box-ports">
//                 {...new Array(this.props.box.outlets).fill(null).map((v, i) => <Outlet {...this.props} index={i} key={i} highlight={i === this.props.highlight} />)}
//             </div>
//         );
//     }
// }
class Io extends React.PureComponent<{ bubble: boolean; editor: PatcherEditor; box: Box; index: number; runtime?: boolean; highlight: boolean; left?: string; top?: string; edge: string; port: string; }, { isConnected: boolean; highlight: boolean }> {
    state = { isConnected: this.props.box.ioLines[this.props.index].size > 0, highlight: false };
    dragged = false;
    componentDidMount() {
        this.props.box.on("connectedPort", this.handleConnectedChange);
        this.props.box.on("disconnectedPort", this.handleConnectedChange);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("connectedPort", this.handleConnectedChange);
        this.props.box.off("disconnectedPort", this.handleConnectedChange);
    }
    handleConnectedChange = (e: BoxEventMap["disconnectedPort" | "connectedPort"]) => {
        // const { isSrc, i, last } = e;
        const { io, last } = e;
        if (io === this.props.index) this.setState({ isConnected: !last });
    };
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;
        if (e.button !== 0) return;
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        this.props.editor.tempLine(true, [this.props.box.id, this.props.index]);
    };
    handleMouseEnter = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;
        if (e.buttons) return;
        this.setState({ highlight: true });
    };
    handleMouseMove = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;
        if (e.currentTarget !== e.target) this.setState({ highlight: false });
    };
    handleMouseLeave = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;
        this.setState({ highlight: false });
    };
    render() {
        const { box, index: i, editor, left, top, edge, port } = this.props;

        const popupOffset = {
            'T': [0],
            'R': [0, 5],
            'B': [0, 5],
            'L': [0, 5],
        }[edge];

        const highlight = this.state.highlight || this.props.highlight;
        const bubble = this.props.bubble;
        // const forceHot = editor.props.mode === "gen" || editor.props.mode === "faust";
        let props = { isHot: false, type: "anything", description: "" };
        const meta = box.meta.ios;
        if (meta && meta.length) props = { ...props, ...(i >= meta.length ? ({}) : meta[i]) };
        const className = `box-${port}-port box-${edge}` + (props.isHot ? ` box-${edge}-hot` : ` box-${edge}-cold`) + (this.state.isConnected ? ` box-${port}-port-connected` : "") + (bubble || highlight ? ` box-${port}-port-highlight` : "");
        return (
            <div style={{ left, top }} className={className} onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
                <Popup
                    trigger={<div style={{ pointerEvents: "none" }} />}
                    content={<>{props.description.length ? <span>{props.description}: </span> : undefined}<span style={{ color: "#30a0a0" }}>{props.type}</span></>}
                    position={`${edge} center` as any}
                    open={highlight}
                    size="mini"
                    inverted
                    offset={popupOffset as any}
                />
            </div>
        );
    }
}
// class Outlet extends React.PureComponent< { editor: PatcherEditor; box: Box; index: number; runtime?: boolean; highlight: boolean }, { isConnected: boolean; highlight: boolean }> {
//     state = { isConnected: this.props.box.outletLines[this.props.index].size > 0, highlight: false };
//     dragged = false;
//     componentDidMount() {
//         this.props.box.on("connectedPort", this.handleConnectedChange);
//         this.props.box.on("disconnectedPort", this.handleConnectedChange);
//     }
//     componentWillUnmount() {
//         if (!this.props.box) return;
//         this.props.box.off("connectedPort", this.handleConnectedChange);
//         this.props.box.off("disconnectedPort", this.handleConnectedChange);
//     }
//     handleConnectedChange = (e: BoxEventMap["disconnectedPort" | "connectedPort"]) => {
//         const { isSrc, i, last } = e;
//         if (isSrc && i === this.props.index) this.setState({ isConnected: !last });
//     };
//     handleMouseDown = (e: React.MouseEvent) => {
//         if (this.props.runtime) return;
//         if (this.props.editor.state.locked) return;
//         if (e.button !== 0) return;
//         if (e.target !== e.currentTarget) return;
//         e.stopPropagation();
//         this.props.editor.tempLine(false, [this.props.box.id, this.props.index]);
//     };
//     handleMouseEnter = (e: React.MouseEvent) => {
//         if (this.props.runtime) return;
//         if (this.props.editor.state.locked) return;
//         if (e.buttons) return;
//         this.setState({ highlight: true });
//     };
//     handleMouseLeave = () => {
//         if (this.props.runtime) return;
//         if (this.props.editor.state.locked) return;
//         this.setState({ highlight: false });
//     };
//     handleMouseMove = (e: React.MouseEvent) => {
//         if (this.props.runtime) return;
//         if (this.props.editor.state.locked) return;
//         if (e.currentTarget !== e.target) this.setState({ highlight: false });
//     };
//     render() {
//         const { box, index: i } = this.props;
//         const highlight = this.state.highlight || this.props.highlight;
//         let props = { type: "anything", description: "" };
//         const meta = box.meta.outlets;
//         if (meta && meta.length) props = { ...props, ...(i >= meta.length ? (meta[meta.length - 1].varLength ? meta[meta.length - 1] : {}) : meta[i]) };
//         const className = "box-port box-outlet" + (this.state.isConnected ? " box-port-connected" : "") + (highlight ? " box-port-highlight" : "");
//         return (
//             <div className={className} onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
//                 <Popup
//                     trigger={<div />}
//                     content={<>{props.description.length ? <span>{props.description}: </span> : undefined}<span style={{ color: "#30a0a0" }}>{props.type}</span></>}
//                     position="bottom center"
//                     open={highlight}
//                     size="mini"
//                     inverted
//                     offset={[0, 5]}
//                 />
//             </div>
//         );
//     }
// }
