import { ASTAttr, ParseOptions } from '../domain';

const NCNAME = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const QNAME_CAPTURE = `((?:${NCNAME}\\:)?${NCNAME})`;
const START_TAG_OPEN = new RegExp(`^<${QNAME_CAPTURE}`);
const START_TAG_CLOSE = /^\s*(\/?)>/
const END_TAG = new RegExp(`^<\\/${QNAME_CAPTURE}[^>]*>`);

const ATTRIBUTE = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

export function parseHtml(html: string, options: ParseOptions): any {
    let index = 0;
    while (html) {
        const textEnd = html.indexOf('<');
        if (textEnd === 0) {
            const endTagMatch = html.match(END_TAG);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                options.end(endTagMatch[1])
            }

            const startTagMatch = html.match(START_TAG_OPEN)
            if (startTagMatch) {
                advance(startTagMatch[0].length);
                let end, attr;
                const attrs: ASTAttr[] = [];
                while (!(end = html.match(START_TAG_CLOSE)) && (attr = html.match(ATTRIBUTE))) {
                    attrs.push({
                        name: attr[1],
                        value: attr[3] || attr[4] || attr[5] || '',
                    })
                    advance(attr[0].length);
                }
                if (end) {
                    advance(end[0].length);
                }
                options.start(startTagMatch[1], attrs)
            }
        }

        let text: string;
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }
        if (textEnd < 0) {
            text = html;
        }

        if (text) {
            advance(text.length);
            options.text(text,)
        }
    }

    function advance(n: number): void {
        index += n;
        html = html.substring(n)
    }

}
