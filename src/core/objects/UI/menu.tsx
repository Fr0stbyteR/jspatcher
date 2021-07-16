import * as React from "react";
import { StrictDropdownProps, DropdownProps, Dropdown, StrictDropdownItemProps } from "semantic-ui-react";
import UIObject from "./Base";
import { BaseUI, BaseUIState } from "../BaseUI";
import { isNumberArray } from "../../../utils/utils";
import { IJSPatcherObjectMeta, IPropsMeta } from "../../types";

/* eslint-disable object-property-newline */
type MenuProps = Required<Pick<
    StrictDropdownProps,
    "clearable" | "closeOnBlur" | "closeOnChange" | "closeOnEscape" | "deburr"
    | "defaultOpen" | "defaultValue" | "direction" | "disabled" | "error" | "lazyLoad"
    | "minCharacters" | "multiple" | "noResultsMessage" | "options" | "placeholder"
    | "scrolling" | "search" | "selectOnBlur" | "selectOnNavigation" | "simple"
    | "tabIndex" | "text" | "upward" | "wrapSelection"
>>;
type MenuUIState = { value: StrictDropdownProps["value"] } & MenuProps;
class MenuUI extends BaseUI<menu, {}, MenuUIState> {
    state: MenuUIState & BaseUIState = {
        ...this.state,
        value: this.object.getProp("defaultValue")
    };
    handleChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const { value } = data;
        this.setState({ value });
        this.object.outlet(0, value);
    };
    handleQuery = (query: number | string | number[] | string[]) => {
        const { options } = this.state;
        let value;
        if (typeof query === "number") {
            if (options[query]) {
                value = options[query].value;
            }
        } else if (typeof query === "string") {
            const found = options.find(o => o.text === query);
            if (found) {
                value = found.value;
            }
        } else if (isNumberArray(query)) {
            value = query.filter(i => !!options[i]).map(i => options[i].value);
        } else {
            value = options.filter(o => query.indexOf(o.text as string) !== -1).map(o => o.value);
        }
        if (value) {
            this.setState({ value });
            this.object.outlet(0, value);
        }
    };
    componentDidMount() {
        super.componentDidMount();
        this.object.on("query", this.handleQuery);
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.object.off("query", this.handleQuery);
    }
    render() {
        const {
            clearable, closeOnBlur, closeOnChange, closeOnEscape, deburr,
            defaultOpen, defaultValue, direction, disabled, error, lazyLoad,
            minCharacters, multiple, noResultsMessage, options, placeholder,
            scrolling, search, selectOnBlur, selectOnNavigation, simple,
            tabIndex, text, upward, wrapSelection, value
        } = this.state;
        const dropdownProps = {
            clearable, closeOnBlur, closeOnChange, closeOnEscape, deburr,
            defaultOpen, defaultValue, direction, disabled, error, lazyLoad,
            minCharacters, multiple, noResultsMessage, options, placeholder,
            scrolling, search, selectOnBlur, selectOnNavigation, simple,
            tabIndex, text, upward, wrapSelection, value
        };
        return (
            <BaseUI {...this.props}>
                <Dropdown {...dropdownProps} selection fluid onChange={this.handleChange} />
            </BaseUI>
        );
    }
}
export default class menu extends UIObject<{}, {}, [number | string | number[] | string[], StrictDropdownItemProps[]], [any], [], MenuProps, MenuUIState, { query: number | string | number[] | string[] }> {
    static description = "Dropdown Menu";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "number or display text or array to select item(s)"
    }, {
        isHot: false,
        type: "object",
        description: "Array of DropdownItemProps: { key, icon, text, value, ... }"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Selected value"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        varLength: true,
        optional: true,
        default: undefined,
        description: "Initial value(s)"
    }];
    static props: IPropsMeta<MenuProps> = {
        clearable: {
            type: "boolean",
            default: false,
            description: "Using the clearable setting will let users remove their selection",
            isUIState: true
        },
        closeOnBlur: {
            type: "boolean",
            default: true,
            description: "Whether or not the menu should close when the dropdown is blurred",
            isUIState: true
        },
        closeOnChange: {
            type: "boolean",
            default: undefined,
            description: "Whether or not the menu should close when a value is selected",
            isUIState: true
        },
        closeOnEscape: {
            type: "boolean",
            default: true,
            description: "Whether or not the dropdown should close when the escape key is pressed",
            isUIState: true
        },
        deburr: {
            type: "boolean",
            default: false,
            description: "Whether or not the dropdown should strip diacritics in options and input search",
            isUIState: true
        },
        defaultOpen: {
            type: "boolean",
            default: false,
            description: "Initial value of open",
            isUIState: true
        },
        defaultValue: {
            type: "anything",
            default: undefined,
            description: "Initial value or value array if multiple",
            isUIState: true
        },
        direction: {
            type: "enum",
            enums: ["left", "right"],
            default: "left",
            description: "A dropdown menu can open to the left or to the right",
            isUIState: true
        },
        disabled: {
            type: "boolean",
            default: false,
            description: " A disabled dropdown menu or item does not allow user interaction",
            isUIState: true
        },
        error: {
            type: "boolean",
            default: false,
            description: "An errored dropdown can alert a user to a problem",
            isUIState: true
        },
        lazyLoad: {
            type: "boolean",
            default: false,
            description: "A dropdown can defer rendering its options until it is open",
            isUIState: true
        },
        minCharacters: {
            type: "number",
            default: 1,
            description: "The minimum characters for a search to begin showing results",
            isUIState: true
        },
        multiple: {
            type: "boolean",
            default: false,
            description: "A selection dropdown can allow multiple selections",
            isUIState: true
        },
        noResultsMessage: {
            type: "string",
            default: "No results found",
            description: "Message to display when there are no results",
            isUIState: true
        },
        options: {
            type: "anything",
            default: [],
            description: "Array of Dropdown.Item props",
            isUIState: true
        },
        placeholder: {
            type: "string",
            default: "",
            description: "Placeholder text",
            isUIState: true
        },
        scrolling: {
            type: "boolean",
            default: false,
            description: "A dropdown can have its menu scroll",
            isUIState: true
        },
        search: {
            type: "boolean",
            default: false,
            description: "A selection dropdown can allow a user to search through a large list of choices",
            isUIState: true
        },
        selectOnBlur: {
            type: "boolean",
            default: true,
            description: "Whether the highlighted item should be selected on blur",
            isUIState: true
        },
        selectOnNavigation: {
            type: "boolean",
            default: true,
            description: "Whether dropdown should select new option when using keyboard shortcuts.",
            isUIState: true
        },
        simple: {
            type: "boolean",
            default: false,
            description: "A dropdown menu can open to the left or to the right",
            isUIState: true
        },
        tabIndex: {
            type: "anything",
            default: undefined,
            description: "A dropdown can receive focus",
            isUIState: true
        },
        text: {
            type: "string",
            default: undefined,
            description: "The text displayed in the dropdown, usually for the active item",
            isUIState: true
        },
        upward: {
            type: "boolean",
            default: false,
            description: "Controls whether the dropdown will open upward",
            isUIState: true
        },
        wrapSelection: {
            type: "boolean",
            default: false,
            description: "Selection will wrap to end or start on press ArrowUp or ArrowDown",
            isUIState: true
        }
    };
    static UI = MenuUI;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this.emit("query", data as number | string | number[] | string[]);
            } else {
                const options = data as StrictDropdownItemProps[];
                this.update(undefined, { options });
            }
        });
    }
}
