/**
 * Gutenberg Frontend Scripts
 * 
 * @version 0.1
 * 
 * 1 - Font Family resolver
 */

/**
 * Font Family resolver
 * Resolves the font source loading from Gutenberg blocks on frontend
 * 
 * @version 0.1
 */

class FontFamilyResolver {

    constructor() {
        this.elements = Array.from(document.querySelectorAll('[font]'));
        this.getJSON();
    }

    getJSON () {
        /** !! I don't like this way... !! **/
        //const fontsUrl = window.origin + '/wp-content/plugins/gutenberg-extra/customizer/dist/fonts.json';
        const fontsUrl = window.origin + '/gutenden/wp-content/plugins/gutenberg-extra/customizer/dist/fonts.json';
        fetch ( fontsUrl )
            .then ( (result) => {
                return result.json();
            })
            .then ( (data) => {
                this.getOptions(data);
                this.initEvents();
            })
            .catch ( (err) => {
                console.log ( err )
            });
    }

    getOptions ( data ) {
        this.options = this.getFontFamilyOptions(data);
    }

    initEvents() {
        this.elements.map(e => {
            const font = e.getAttribute('font');
            this.options.forEach(e => {
                if (e.label === font) {
                    this.loadFonts(e.label, e.files);
                }
            })
            e.removeAttribute('font');
        })
    }

    /**
     * Get font families from GFonts JSON file
     * 
     * @param {JSON} data Recibes JSON data with the fonts variants and properties
     * @returns {array} Options ready for React-Select 
     */

    getFontFamilyOptions(data) {
        let options = [];
        let items = data.items;
        items.map(item => {
            options.push({
                label: item.family,
                value: item.family,
                files: item.files
            });
        });
        return options;
    }

    /**
     * Loads the font on background using JS FontFace API
     * 
     * @param {string} font Name of the selected font
     * @param {obj} files Different variations of the font
     */

    loadFonts = (font, files) => {
        // Avoid reloading fonts already load
        for (var fontFace of document.fonts.values()) {
            if (fontFace.family === font) {
                return;
            }
        }
        if (document.fonts) {   // FontFace API
            Object.entries(files).map(variant => {
                const style = this.getFontStyle(variant[0]);
                const fontLoad = new FontFace(font, `url(${variant[1]})`, style);
                document.fonts.add(fontLoad);
                fontLoad.loaded.catch((err) => {
                    console.info(__(`Font hasn't been able to download: ${err}`))
                })
            })
        }
    }

    /**
     * Prepares the styles to be ready for JS FontFace API
     * 
     * @param {obj} variant Concrete variant of the font with name and url
     * @returns {obj} Styles options for load the font on FontFace API
     */

    getFontStyle = (variant) => {
        const styles = variant.split(/([0-9]+)/).filter(Boolean);
        if (styles.length > 1) {
            return {
                style: `${styles[1]}`,
                weight: `${styles[0]}`
            };
        } else {
            const regExp = new RegExp('([0-9]+)', 'gm');
            if (styles[0].search(regExp) >= 0) {  // number
                return { weight: `${styles[0]}` };
            } else {
                return { style: `${styles[0]}` };
            }
        }
    }
}

document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
        new FontFamilyResolver;
    }
}