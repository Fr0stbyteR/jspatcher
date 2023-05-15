import * as React from "react";
import type Env from "../../../Env";
import type Box from "../../Box";
import type PatcherEditor from "../../HardwareEditor";
import type { IJSPatcherObject, IPropsMeta, Props } from "./AbstractHardwareObject";

export interface AbstractUIProps<T extends IJSPatcherObject = IJSPatcherObject> {
    object: T;
    editor: PatcherEditor;
    inDock?: boolean;
    editing: boolean;
    onEditEnd: () => any;
}
export interface AbstractUIState {
    width: number | string;
    height: number | string;
}
export default abstract class AbstractUI<
        T extends IJSPatcherObject = IJSPatcherObject,
        P extends Partial<AbstractUIProps<T>> & Record<string, any> = {},
        S extends Partial<AbstractUIState> & Record<string, any> = {}
> extends React.PureComponent<AbstractUIProps<T> & P, S & AbstractUIState> {
    /** Sizing rule */
    static sizing: "horizontal" | "vertical" | "both" | "ratio";
    /** Default Size while object is created. */
    static defaultSize: [number, number];
    /** If set to true, call this.props.onEditEnd at some point */
    static editableOnUnlock: boolean;
    /** If this UI can be displayed elsewhere */
    static dockable: boolean;
    state: S & AbstractUIState = {
        ...this.state,
        ...this.objectProps,
        width: this.box.getWidth(this.editor.state.presentation),
        height: this.box.getHeight(this.editor.state.presentation)
    };
    get dockable() {
        return (this.constructor as typeof AbstractUI).dockable;
    }
    get object(): T {
        return this.props.object;
    }
    get patcher() {
        return this.props.object.patcher;
    }
    get env() {
        return this.props.object.patcher.env as Env;
    }
    get editor() {
        return this.props.editor;
    }
    get box(): Box<T> {
        return this.props.object.box;
    }
    get objectProps() {
        const props: Partial<Props<T>> = {};
        const objectProps = this.object.meta.props as IPropsMeta<Props<T>>;
        for (const key in objectProps) {
            if (objectProps[key].isUIState) props[key] = (this.object as any).getProp(key);
        }
        return props;
    }
    private _handleUIUpdate = (e?: Pick<S & AbstractUIState, keyof (S & AbstractUIState)>) => {
        if (e) this.setState(e);
        else this.forceUpdate();
    };
    private _handleResized = () => {
        const width = this.box.getWidth(this.editor.state.presentation);
        const height = this.box.getHeight(this.editor.state.presentation);
        if (width !== this.state.width || height !== this.state.height) this.setState({ width, height });
    };
    componentDidMount() {
        delete this.box._editing;
        this.object.on("updateUI", this._handleUIUpdate);
        if (this.dockable && this.props.inDock) return;
        this.box.on("rectChanged", this._handleResized);
        this.box.on("presentationRectChanged", this._handleResized);
        this.editor.on("presentation", this._handleResized);
    }
    componentWillUnmount() {
        this.object.off("updateUI", this._handleUIUpdate);
        if (this.dockable && this.props.inDock) return;
        this.box.off("rectChanged", this._handleResized);
        this.box.off("presentationRectChanged", this._handleResized);
        this.editor.off("presentation", this._handleResized);
    }
    render() {
        return <></>;
    }
}
