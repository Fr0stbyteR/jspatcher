import * as React from "react";
import type PatcherEditor from "../../core/patcher/PatcherEditor";
import { IJSPatcherObjectMeta } from "../../core/objects/base/AbstractObject";
import { Placeholder } from "semantic-ui-react";

type ReferenceState = {
    meta?: IJSPatcherObjectMeta;
    name?: string;
    loading: boolean;
};

export default class Reference extends React.PureComponent<{ editor: PatcherEditor }, ReferenceState> {
    state: ReferenceState = { meta: null, loading: false };
    innerRef = React.createRef<HTMLDivElement>();
    handleSelected = async () => {
        // Get all the selected boxes that are non-null
        const boxes = this.props.editor.state.selected.filter(id => id.startsWith("box") && this.props.editor.boxes[id]).map(id => this.props.editor.boxes[id]);
        if (boxes.length === 0) {
            this.state.meta = null;
            return;
        }

        // We'll simply look at one reference document at a time
        const meta = boxes[0].meta;
        const name = boxes[0].text.split(' ')[0];
        if (this.state.name === name || name === '' || name === 'InvalidObject' || name === 'DefaultObject')
            return;

        this.setState({ meta, name, loading: true });

        if (!meta.docs) {
            this.innerRef.current.innerHTML = '<p>This object does not yet have documentation.</p>';
            this.setState({ loading: false });
            return;
        }

        const t1 = new Date();

        fetch(
            `https://web-patcher.sfo3.digitaloceanspaces.com/docs/${meta.docs}`
        )
            .then(d => d.text())
            .then(async (html) => {
                // If the html starts with a title of name, remove it
                const title_regex = /<h1>(?:<a.+?><\/a>)?\s*(.+?)\s*<\/h1>/;
                const match = html.match(title_regex);
                if (match && match[1] == this.state.name) {
                    html = html.replace(title_regex, '');
                }

                // Ensure it takes at least 500ms to load to avoid flashing
                const t2 = new Date();
                const diff = t2.getTime() - t1.getTime();

                if (diff < 400) {
                    const remaining = 500 - diff;
                    await new Promise(resolve => setTimeout(resolve, remaining));
                }

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
        const { meta, name, loading } = this.state;

        const paragraphs = [...Array(3)].map(_ => 2 + Math.round(Math.random() * 10));

        return (
            <>
                <div className="markdown-body">
                    <h1>{name ? name : `Reference`}</h1>
                    {/* <hr /> */}
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
                    <div style={{ marginBottom: '1em' }} ref={this.innerRef} hidden={loading}></div>
                </div>
            </>
        );
    }
}
