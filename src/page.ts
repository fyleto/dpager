import { Interaction, ButtonBuilder, ButtonStyle } from "discord.js";

interface Page {
    /**
     * Title of the page. Will default to embed title if not given
     */
    title?: string;
    /**
     * Content of the page.
     */
    content: string;
}

interface PagerButton {
    /**
     * Do not add this property. Pager does this for you.
     */
    customId: string;
    style?: ButtonStyle;
    label?: string;
    emoji?: string;
}

/**
 * 1 Array of strings, 2 Array of objects. 0 none.
 * @param arr
 * @returns
 */
const type = (arr: any[]): 0 | 1 | 2 =>
    Array.isArray(arr) && arr.length > 0
        ? arr.every((item) => typeof item === "object" && item !== null)
            ? 2
            : arr.every((item) => typeof item === "string")
            ? 1
            : 0
        : 0;
type keys = "prevPage" | "nextPage" | "nextMaxPage" | "prevMaxPage";
export class Pager {
    /**
     * Array of pages. to access a page just use Pager.pages[index]
     */
    pages: Page[] = [];
    private interaction?: Interaction;
    private _ids = {
        nextPage: "pageNextPage",
        prevPage: "pevPage",
        nextMaxPage: "nextMaxpage",
        prevMaxPage: "prevMaxPage",
    };
    private buttons: {
        nextPage?: PagerButton;
        prevPage?: PagerButton;
        nextMaxPage?: PagerButton;
        prevMaxPage?: PagerButton;
    } = {
        nextPage: {
            customId: this._ids.nextPage,
            label: ">",
            style: ButtonStyle.Success,
        },
        prevPage: {
            customId: this._ids.prevPage,
            label: "<",
            style: ButtonStyle.Success,
        },
        nextMaxPage: {
            customId: this._ids.nextMaxPage,
            label: ">>",
            style: ButtonStyle.Success,
        },
        prevMaxPage: {
            customId: this._ids.prevMaxPage,
            label: "<<",
            style: ButtonStyle.Success,
        },
    };

    /**
     * Create the pager.
     * @param I If you plan on using the Pager to display the pages. pass the interaction here.
     */
    constructor(I?: Interaction) {
        this.interaction = I;
    }

    config(i: {
        nextPage?: PagerButton;
        prevPage?: PagerButton;
        nextMaxPage?: PagerButton;
        prevMaxPage?: PagerButton;
    }): void {
        function updateButton(
            buttonType: "prevPage" | "nextPage" | "nextMaxPage" | "prevMaxPage",
            input: {
                [key: string]: PagerButton;
            }
        ) {
            if (i[buttonType]) {
                this.buttons[buttonType].emoji =
                    input[buttonType]?.emoji !== undefined
                        ? input[buttonType].emoji
                        : this.buttons[buttonType].emoji;
                this.buttons[buttonType].label =
                    input[buttonType]?.label !== undefined
                        ? input[buttonType].label
                        : this.buttons[buttonType].label;
                this.buttons[buttonType].style =
                    input[buttonType]?.style !== undefined
                        ? input[buttonType].style
                        : this.buttons[buttonType].style;
            }
        }
        updateButton("prevPage", i);
        updateButton("nextPage", i);
        updateButton("nextMaxPage", i);
        updateButton("prevMaxPage", i);
    }

    /**
     * Add a page
     * @param T Object with properties: string and content.
     */
    addPage(T: Page): void;
    /**
     * Add a page
     * @param T String that represents the content of the page.
     */
    addPage(T: string): void;

    addPage(T: Page | string): void {
        if (typeof T === "string") {
            let page: Page = { title: undefined, content: T };
            this.pages.push(page);
        } else {
            this.pages.push({
                title: T.title || undefined,
                content: T.content,
            });
        }
    }

    /**
     * Add a pages
     * @param T Object with properties: string and content.
     */
    addPages(...T: Page[]): void;
    /**
     * Add a page
     * @param T String that represents the content of the page.
     */
    addPages(...T: string[]): void;

    addPages(...T: Page[] | string[]): void {
        if (type(T) === 1) {
            for (const content of T as string[]) {
                this.pages.push({ title: undefined, content: content });
            }
        } else {
            let pages: Page[];
            for (const page of T as Page[]) {
                this.pages.push({
                    title: page.title || undefined,
                    content: page.content,
                });
            }
        }
    }

    /**
     * Remove a page by it's index
     * @param index Page Index
     */
    removePage(index: number) {
        this.pages.splice(index, 1);
    }

    /**
     * Turn a long array of strings into pages.
     * @param array Array of strings.
     * @param maxContentPerPage Max amount of content a page can have (If you seprate using \n then think of this as max amount of lines)
     * @param separator What to seprate the array contents by. Defaults to a line break.
     */
    addDynamicPages(
        array: string[],
        maxContentPerPage: number,
        separator?: string
    ): void {
        separator = separator !== undefined ? separator : "\n"
        for (let i = 0; i < array.length; i += maxContentPerPage) {
            const slicedArray = array.slice(i, i + maxContentPerPage);
            const content = slicedArray.join(separator);
            this.addPage({ content });
        }
    }
}