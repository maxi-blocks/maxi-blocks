/**
 * Internal dependencies
 */
import fontsJSON from './font';

/**
 * Font Family resolver
 * Resolves the font source loading from Gutenberg blocks on backend andfrontend
 */
export class FontFamilyResolver {
    constructor() {
        this.elements = this.elemensGetter;
        this.onLoadPage();
        document.body.classList.contains('block-editor-page') &&
        !document.getElementById('fontOptions')
            ? this.getJSON()
            : null;
    }

    /**
     * Returns an array with all the elements with a font-family CSS style option
     *
     * @return {Array} elements with font-family on inline style
     */
    get elemensGetter() {
        return Array.from(document.querySelectorAll('[style]')).filter(e => {
            return (
                typeof window
                    .getComputedStyle(e)
                    .getPropertyValue('font-family') !== ''
            );
        });
    }

    /**
     * Returns a non-repeated element list of the family fonts founded on the DOM
     *
     * @return {set} List of font families on the DOM
     */
    get DOMFontList() {
        let list = new Set();
        this.elements.map(e => {
            const fonts = window
                .getComputedStyle(e)
                .getPropertyValue('font-family');
            fonts.split(',').map(font => {
                list = list.add(font.replace('"', '').trim());
            });
        });
        return list;
    }

    /**
     * Retrieve an object with all the GFonts options
     *
     * @returns {Object} GFonts options
     * @returns {null}
     */
    get optionsGetter() {
        if (document.getElementById('fontOptions')) {
            return JSON.parse(document.getElementById('fontOptions').innerHTML);
        }
        return null;
    }

    /**
     * Fetchs the JSON file with all the GFonts options
     */
    getJSON() {
        const script = document.createElement('script');
        script.id = 'fontOptions';
        script.innerHTML = JSON.stringify(this.getFontFamilyOptions(fontsJSON));
        document.body.appendChild(script);
    }

    /**
     * Loads the non-loaded fonts on backend and frontend
     */
    onLoadPage() {
        if (typeof fontsToLoad !== 'undefined') {
            for (const [fontName, fontOptions] of Object.entries(fontsToLoad)) {
                this.loadFonts(fontName, fontOptions);
            }
        }
    }

    /**
     * Get font families from GFonts JSON file
     *
     * @param {JSON} data Recibes JSON data with the fonts variants and properties
     * @returns {Array} Options ready for React-Select
     */
    getFontFamilyOptions(data) {
        const options = [];
        const { items } = data;
        items.map(item => {
            options.push({
                label: item.family,
                value: item.family,
                files: item.files,
            });
        });
        return options;
    }

    /**
     * Loads the font on background using JS FontFace API
     * FontFaceSet API uses check() to check if a font exists, but needs to compare with some exact value:
     * in this case is used '12px' as a standard that returns if the font has been loaded.
     *
     * @param {string} font Name of the selected font
     * @param {obj} files Different variations of the font
     */
    loadFonts = (font, files) => {
        if (document.fonts && !document.fonts.check(`12px ${font}`)) {
            // FontFace API
            Object.entries(files).map(variant => {
                const style = this.getFontStyle(variant[0]);
                const fontLoad = new FontFace(
                    font,
                    `url(${variant[1]})`,
                    style
                );
                document.fonts.add(fontLoad);
                fontLoad.loaded.catch(err => {
                    console.info(
                        __(`Font hasn't been able to download: ${err}`)
                    );
                });
            });
        }
    };

    /**
     * Prepares the styles to be ready for JS FontFace API
     *
     * @param {obj} variant Concrete variant of the font with name and url
     * @returns {obj} Styles options for load the font on FontFace API
     */
    getFontStyle = variant => {
        const styles = variant.split(/([0-9]+)/).filter(Boolean);
        if (styles.length > 1) {
            return {
                style: `${styles[1]}`,
                weight: `${styles[0]}`,
            };
        }
        const regExp = new RegExp('([0-9]+)', 'gm');
        if (styles[0].search(regExp) >= 0) {
            // number
            return { weight: `${styles[0]}` };
        }
        return { style: `${styles[0]}` };
    };
}

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        new FontFamilyResolver();
    }
};
