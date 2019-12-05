/*

Ultra simple automatic documentation system for Faust.
Creates a markdown file by extracting the comments from
a Faust file. The option -t n can be used to change the
default (4) tab setting. The option -c can be used to
include the Faust code itself into the generated doc.
And the option -f can be used to include a YAML front
matter with the name of the file and the date.

The format of a title is :
    //############# Title Name #################
    //  markdown text....
    //  markdown text....
    //##########################################

The format of a section is :
    //============== Section Name ==============
    //  markdown text....
    //  markdown text....
    //==========================================

The format of a comment is :
    //-------------- foo(x,y) ------------------
    //  markdown text....
    //  markdown text....
    //------------------------------------------
everything else is considered Faust code.
The translation is the following:
  ## foo(x,y)
    markdown text....
    markdown text....
--------------------------------------------------------
*/
type Faust2MDOptions = { tabsize: number; code: boolean; front: boolean };
/**
 * faust2md ts port
 *
 * @class Faust2MD
 */
export class Faust2MD {
    private static readonly REGEX_BEG_TITLE = /^\s*\/\/#{3,}\s*([^#]*[^#\s])\s*#{3,}$/;
    private static readonly REGEX_END_TITLE = /^\s*((\/\/#{3,})|(\s*))$/;
    private static readonly REGEX_BEG_SECTION = /^\s*\/\/={3,}\s*([^=]*[^=\s])\s*={3,}$/;
    private static readonly REGEX_END_SECTION = /^\s*((\/\/={3,})|(\s*))$/;
    private static readonly REGEX_BEG_COMMENT = /^\s*\/\/-{3,}\s*([^-]*[^=\s])\s*-{3,}$/;
    private static readonly REGEX_END_COMMENT = /^\s*((\/\/-{3,})|(\s*))$/;
    private static readonly REGEX_INDENT = /(^\s*\/\/\s*)[^\s]/;
    private static readonly REGEX_COMMENT = /^\s*\/\//;
    /**
     * Print the front matter of the file
     *
     * @static
     * @param {string} fileName
     * @returns {string}
     * @memberof Faust2MD
     */
    static frontMatter(fileName: string): string {
        return "---\n"
        + `file: ${fileName}\n`
        + `date: ${new Date().toLocaleDateString()}\n`
        + "---\n";
    }
    /**
     * Outdent a comment line by n characters in
     * order to remove the prefix "//   "
     *
     * @static
     * @param {string} line
     * @param {number} idt
     * @returns {string}
     * @memberof Faust2MD
     */
    static outdent(line: string, idt: number): string {
        return line.length <= idt ? "\n" : line.substr(idt);
    }
    /**
     * Match the first line of a title
     * of type "//#### Title ####"
     * at least 3 # are needed
     *
     * @static
     * @param {string} line
     * @returns {string}
     * @memberof Faust2MD
     */
    static matchBeginTitle(line: string): string {
        const matched = line.match(this.REGEX_BEG_TITLE);
        return matched ? matched[1] : null;
    }
    /**
     * Match the last line of a title
     * of type "//########"
     * or a blank line
     *
     * @static
     * @param {string} line
     * @returns {boolean}
     * @memberof Faust2MD
     */
    static matchEndTitle(line: string): boolean {
        const matched = line.match(this.REGEX_END_TITLE);
        return !!matched;
    }
    /**
     * Match the first line of a section
     * of type "//==== Section ===="
     * at least 3 = are needed
     *
     * @static
     * @param {string} line
     * @returns {string}
     * @memberof Faust2MD
     */
    static matchBeginSection(line: string): string {
        const matched = line.match(this.REGEX_BEG_SECTION);
        return matched ? matched[1] : null;
    }
    /**
     * Match the last line of a section
     * of type "//======="
     * or a blank line
     *
     * @static
     * @param {string} line
     * @returns {boolean}
     * @memberof Faust2MD
     */
    static matchEndSection(line: string): boolean {
        const matched = line.match(this.REGEX_END_SECTION);
        return !!matched;
    }
    /**
     * Match the first line of a comment
     * of type "//--- foo(x,y) ----"
     * at least 3 - are needed
     *
     * @static
     * @param {string} line
     * @returns {string}
     * @memberof Faust2MD
     */
    static matchBeginComment(line: string): string {
        const matched = line.match(this.REGEX_BEG_COMMENT);
        return matched ? matched[1] : null;
    }
    /**
     * Match the last line of a comment
     * of type "//-----------------"
     * or a blank line
     *
     * @static
     * @param {string} line
     * @returns {boolean}
     * @memberof Faust2MD
     */
    static matchEndComment(line: string): boolean {
        const matched = line.match(this.REGEX_END_COMMENT);
        return !!matched;
    }
    /**
     * Measure the indentation of a md-comment line
     * that is the len of the prefix '//   '
     *
     * @static
     * @param {string} line
     * @returns {number}
     * @memberof Faust2MD
     */
    static indentation(line: string): number {
        const matched = line.match(this.REGEX_INDENT);
        return matched ? matched[1].length : 0;
    }
    /**
     * Indicates if a line is a comment
     *
     * @static
     * @param {string} line
     * @returns {boolean}
     * @memberof Faust2MD
     */
    static isComment(line: string): boolean {
        const matched = line.match(this.REGEX_COMMENT);
        return !!matched;
    }
    /**
     * Process the file
     *
     * @static
     * @param {string} strIn
     * @param {string} [fileName]
     * @param {{ tabsize?: number, code?: boolean, front?: boolean }} [optionsIn]
     * @returns {string}
     * @memberof Faust2MD
     */
    static parse(strIn: string, fileName?: string, optionsIn?: { tabsize?: number; code?: boolean; front?: boolean }): string {
        const options: Faust2MDOptions = { tabsize: 4, code: false, front: false, ...optionsIn };
        let strOut = "";
        let inComment = false; // false: in code; true: in md-comment
        let idt = 0; // indentation retained to outdent comment lines
        if (options.front && fileName) strOut += this.frontMatter(fileName);
        strIn.split("\n").forEach((line) => {
            if (!this.isComment(line)) {
                if (inComment) { // we are closing a md-comment
                    strOut += "\n";
                    inComment = false;
                }
                if (options.code) strOut += `\t${line}\n`;
                return;
            }
            if (inComment) { // we are in a md-comment
                if (idt === 0) idt = this.indentation(line); // we have to measure the indentation
                // check end of md-comment
                const { endC, endS, endT } = { endC: this.matchEndComment(line), endS: this.matchEndSection(line), endT: this.matchEndTitle(line) };
                if (endC) strOut += "\n---\n\n";
                if (endC || endS || endT) inComment = false; // end of md-comment switch back to mode O
                else strOut += this.outdent(line, idt) + "\n";
                return;
            }
            // check begin of md-comment
            const { c, s, t } = { c: this.matchBeginComment(line), s: this.matchBeginSection(line), t: this.matchBeginTitle(line) };
            if (c) strOut += `\n### ${c}\n`;
            else if (s) strOut += `\n## ${s}\n`;
            else if (t) strOut += `\n# ${t}\n`;
            if (c || s || t) {
                inComment = true;
                idt = 0;
            } else if (options.code) strOut += `\t${line}\n`;
        });
        return strOut;
    }
}
