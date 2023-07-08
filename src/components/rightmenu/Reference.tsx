import * as React from "react";
import type PatcherEditor from "../../core/patcher/PatcherEditor";
import { IJSPatcherObjectMeta } from "../../core/objects/base/AbstractObject";
import { Placeholder } from "semantic-ui-react";

type ReferenceState = {
    meta?: IJSPatcherObjectMeta;
    loading: boolean;
};

export default class Reference extends React.PureComponent<{ editor: PatcherEditor }, ReferenceState> {
    state: ReferenceState = { meta: null, loading: false };
    innerRef = React.createRef<HTMLDivElement>();
    handleSelected = async () => {
        // Get all the selected boxes that are non-null
        const boxes = this.props.editor.state.selected.filter(id => id.startsWith("box") && this.props.editor.boxes[id]).map(id => this.props.editor.boxes[id]);
        // console.log(boxes);
        if (boxes.length === 0) {
            this.state.meta = null;
            return;
        }

        // We'll simply look at one reference document at a time
        const meta = boxes[0].meta;

        if (this.state.meta === meta)
            return;

        this.setState({ meta: meta });
        this.setState({ loading: true });

        // For testing skeleton
        // await new Promise(r => setTimeout(r, 1500));

        // TODO -- replace with actual component acquisition method
        fetch(
            `https://raw.githubusercontent.com/CorvusPrudens/jspatcher/dev/docs_example.html`
        )
            .then(d => d.text())
            .then(html => {
                this.innerRef.current.innerHTML = html;
                this.setState({ loading: false });
            })
            .catch(error => {
                this.innerRef.current.innerHTML = '';
                console.error(error);
                this.setState({ loading: false });
            })
    }
    componentDidMount() {
        this.handleSelected();
        this.props.editor.on("selected", this.handleSelected);
    }
    componentWillUnmount() {
        this.props.editor.off("selected", this.handleSelected);
    }
    render() {
        const { meta, loading } = this.state;

        const paragraphs = [...Array(6)].map(_ => 2 + Math.round(Math.random() * 10));

        return (
            <>
                <div className="reference-container">
                    <h1>{meta ? `${meta.name}` : `Reference`}</h1>
                    <hr />
                    {loading ?
                        <Placeholder inverted fluid className="placeholder">
                            <Placeholder.Header>
                                {...[...Array(2)].map(_ => <Placeholder.Line />)}
                            </Placeholder.Header>
                            {...paragraphs.map(value => {
                                return <>
                                    <Placeholder.Paragraph>
                                        {...[...Array(value)].map(_ => <Placeholder.Line />)}
                                    </Placeholder.Paragraph>
                                </>
                            })}
                        </Placeholder>
                        : <></>}
                    <div ref={this.innerRef} hidden={loading}></div>
                </div>
            </>
        );
    }
}
