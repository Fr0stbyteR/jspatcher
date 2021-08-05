import * as React from "react";
import DefaultUI from "../base/DefaultUI";
import type DefaultObject from "../base/DefaultObject";

export default class ImportedObjectUI<T extends DefaultObject> extends DefaultUI<T> {
    prependColor: string;
    render() {
        return <DefaultUI {...this.props} prependProps={{ style: { backgroundColor: this.prependColor } }} />;
    }
}
