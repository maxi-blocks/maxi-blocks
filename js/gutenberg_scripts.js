/**
 * Gutenberg Frontend Scripts
 * 
 * @version 0.3
 * 
 * 1 - Font Family resolver
 * 2 - Responsive Frontend Styles resolver
 * 3 - Responsive Backend Styles resolver
 * 4 - Fix object follower
 */

/**
 * Font Family resolver
 * Resolves the font source loading from Gutenberg blocks on backend andfrontend
 * 
 * @version 0.2
 */

class FontFamilyResolver {

    constructor() {
        this.elements = this.elemensGetter;
        this.onLoadPage();
        document.body.classList.contains('block-editor-page') &&
            !document.getElementById('fontOptions') ?   // WP editor
            this.getJSON() :
            null;
    }

    /**
     * Returns an array with all the elements with a font-family CSS style option
     * 
     * @return {array} elements with font-family on inline style
     */
    get elemensGetter() {
        return Array.from(document.querySelectorAll('[style]')).filter(e => {
            return typeof window.getComputedStyle(e).getPropertyValue('font-family') !== '';
        })
    }

    /**
     * Returns a non-repeated element list of the family fonts founded on the DOM
     * 
     * @return {set} List of font families on the DOM
     */
    get DOMFontList() {
        let list = new Set();
        this.elements.map(e => {
            const fonts = window.getComputedStyle(e).getPropertyValue('font-family');
            fonts.split(',').map(font => {
                list = list.add(font.replace('"', '').trim());
            })
        })
        return list;
    }

    /**
     * Retrieve an object with all the GFonts options
     *
     * @returns {object} GFonts options
     * @returns {null}
     */
    get optionsGetter() {
        if (document.getElementById('fontOptions')) {
            return JSON.parse(document.getElementById('fontOptions').innerHTML);
        } else {
            return null;
        }
    }

    /**
     * Fetchs the JSON file with all the GFonts options
     */
    getJSON() {
        const fontsUrl = 'https://ddlicensed.s3-eu-west-1.amazonaws.com/gutenberg-extra/fonts.json';
        const options = {
            method: 'GET',
            mode: 'cors',
            header: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }
        fetch(fontsUrl, options)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                this.options = this.getFontFamilyOptions(data);
                this.stampOptions();
                this.onLoadPage();
            })
            .catch(() => {
                console.log(
                    "%cAdvertise: If you are on local, allow CORS on your browser for a better and faster experience",
                    'color: green; background: #222;'
                );
                this.localhostGetJSON()
            });
    }

    /**
     * In case that browser refuses JSON due to CORS, get it from proxy. Slowe process
     */
    localhostGetJSON() {
        const fontsUrl = 'https://cors-anywhere.herokuapp.com/https://ddlicensed.s3-eu-west-1.amazonaws.com/gutenberg-extra/fonts.json';
        const options = {
            method: 'GET',
            mode: 'cors',
            header: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }
        fetch(fontsUrl, options)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                this.options = this.getFontFamilyOptions(data);
                this.stampOptions();
                this.onLoadPage();
            })
            .catch((err) => {
                console.log(err)
            });
    }

    /**
     * Sets a new element on DOM with all the GFonts options
     */
    stampOptions() {
        let script = document.createElement('script');
        script.id = 'fontOptions';
        script.innerHTML = JSON.stringify(this.options);
        document.body.appendChild(script);
    }

    /**
     * Loads the non-loaded fonts on backend and frontend
     */
    onLoadPage() {
        if (typeof fontsToLoad != 'undefined') {
            for (let [fontName, fontOptions] of Object.entries(fontsToLoad)) {
                this.loadFonts(fontName, fontOptions)
            }
        }
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
     * FontFaceSet API uses check() to check if a font exists, but needs to compare with some exact value:
     * in this case is used '12px' as a standard that returns if the font has been loaded.
     * 
     * @param {string} font Name of the selected font
     * @param {obj} files Different variations of the font
     */
    loadFonts = (font, files) => {
        if (document.fonts && !document.fonts.check(`12px ${font}`)) {   // FontFace API
            Object.entries(files).map(variant => {
                const style = this.getFontStyle(variant[0]);
                const fontLoad = new FontFace(font, `url(${variant[1]})`, style);
                document.fonts.add(fontLoad);
                fontLoad.loaded
                    .catch((err) => {
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
    if (document.readyState === 'complete') {
        new FontFamilyResolver;
    }
}

/**
 * Responsive Frontend Styles resolver
 * Creates a new object ready to deliver responsive styles on frontend
 * 
 * @todo    Comment and extend documentation
 * @version 0.2
 */

class ResponsiveStylesResolver {
    constructor(target, meta, object, avoidZero = true) {
        this.target = target;
        this.meta = meta;
        this.object = object;
        this.avoidZero = avoidZero;
        this.newObject = this.objectManipulator();
        this.initEvents();
    }
    initEvents() {
        if (Object.entries(this.meta).length > 0 && this.meta.hasOwnProperty(this.target)) {
            this.hasTarget()
        } else {
            this.noHasTarget()
        }
    }

    hasTarget() {
        this.meta[this.target][this.object.label] = this.newObject;
    }

    noHasTarget() {
        const newEntry = {
            [this.target]: {
                [this.object.label]: this.newObject
            }
        };

        this.meta = Object.assign(this.meta, newEntry);
    }

    objectManipulator() {
        let newObject = {};

        newObject.label = this.object.label;
        newObject = this.propsObjectManipulator(newObject, 'general');
        newObject = this.propsObjectManipulator(newObject, 'desktop');
        newObject = this.propsObjectManipulator(newObject, 'tablet');
        newObject = this.propsObjectManipulator(newObject, 'mobile');
        // On Typography component object
        if (this.object.font) {
            newObject.font = this.object.font;
            newObject.options = this.object.options;
        }

        return newObject;
    }

    propsObjectManipulator(newObject, device) {
        if (typeof this.object[device] === 'undefined') {
            return newObject;
        }
        const object = this.object[device];
        if (device === 'general')
            device = 'desktop'
        if (typeof newObject[device] === 'undefined')
            newObject[device] = {};
        let unitChecker = '';
        let unit = this.object.unit ? this.object.unit : '';

        for (let [target, prop] of Object.entries(object)) {
            if (typeof prop === 'undefined') 
                return;
            // values with dimensions
            if (this.avoidZero){
                if (
                    target != 'sync' && prop != 0 && typeof prop === 'number' || 
                    unitChecker.indexOf(target) == 0 && prop != 0
                )
                    newObject[device][target] = prop + unit;
            }
            else{
                if (
                    target != 'sync' && typeof prop === 'number' || 
                    unitChecker.indexOf(target) == 0
                )
                    newObject[device][target] = prop + unit;
            }
            // avoid numbers with no related metric
            if (unitChecker.indexOf(target) == 0)
                unit = '';
            // values with metrics
            if (prop.length <= 2)
                unitChecker = target, unit = prop;
            // values with strings
            if (prop.length > 2)
                newObject[device][target] = prop;
        }

        if(this.object.label == 'Border width')
            console.log(newObject);
        return newObject;
    }
    get getNewValue() {
        return this.meta;
    }
}

/**
 * Responsive Backend Styles resolver
 * 
 * @version 0.2
 */

class BackEndResponsiveStyles {
    constructor(meta) {
        this.meta = meta;
        // Uses serverside loaded inline css
        this.target = document.getElementById('gutenberg-extra-inline-css');
        typeof this.meta != 'undefined' ?
            this.initEvents() :
            null;
    }

    initEvents() {
        this.target == null ?
            this.createElement() :
            this.addValues();
    }

    /**
     * Creates inline style element on DOM if server-side didn't created before
     */
    createElement() {
        const style = document.createElement('style');
        style.id = 'gutenberg-extra-inline-css';
        document.body.appendChild(style);
        this.target = style;
        this.addValues();
    }

    /**
     * Adds values on the inline style element on DOM
     */
    addValues() {
        const content = this.createContent();
        this.target.innerHTML = content;
    }

    /**
     * Creates the content to append on the inline style element on DOM
     */
    createContent() {
        let content = '';
        for (let [target, prop] of Object.entries(this.meta)) {
            target = this.getTarget(target);
            for (let value of Object.values(prop)) {
                if ((typeof value.desktop != 'undefined' && Object.entries(value.desktop).length != 0) || value.hasOwnProperty('font')) {
                    content += `.${target}{`;
                    content += this.getResponsiveStyles(value.desktop);
                    if (value.hasOwnProperty('font')) {
                        content += `font-family: ${value.font}!important`;
                    }
                    content += '}';
                }
                if (typeof value.tablet != 'undefined' && Object.entries(value.tablet).length != 0) {
                    content += `@media only screen and (max-width: 768px){.${target}{`;
                    content += this.getResponsiveStyles(value.tablet);
                    content += '}}';
                }
                if (typeof value.mobile != 'undefined' && Object.entries(value.mobile).length != 0) {
                    content += `@media only screen and (max-width: 768px){.${target}{`;
                    content += this.getResponsiveStyles(value.mobile);
                    content += '}}';
                }
            }
        }
        return content;
    }

    /**
     * Retrieve cleaned target
     * 
     * @param {string} target style target for scoping
     */
    getTarget(target) {
        if(target.indexOf('__$:') != -1)
            return target.replace('__$', '');
        if(target.indexOf('__$>') != -1)
            return target.replace('__$', '');
        if(target.indexOf('__$#') != -1)
            return target.replace('__$', '');
        return target.replace('__$', ' .');
    }

    /**
     * Retrieve each one of the styles CSS props
     * 
     * @param {obj} styles responsive styles device
     */
    getResponsiveStyles(styles) {
        let responsiveStyles = '';
        for (let [key, value] of Object.entries(styles)) {
            responsiveStyles += ` ${key}: ${value} !important;`;
        }
        return responsiveStyles;
    }

}

/**
 * Fix Object Follower
 * Returns top and left constant position relative to scroll container for fixed elements
 * 
 * @param {node} target     Element to be fixed
 * @param {node} reference  Element to be followed
 * @param {node} scrollEl   Element container with scroll attach
 */

class FixObjectFollower {
    constructor(target, reference, scrollEl, position = 'top') {
        this.target = target;
        this.reference = reference;
        this.scrollEl = scrollEl || document;
        this.position = position;
        this.initEvents();
    }

    initEvents() {
        this.getPosition();
        this.scrollEl.addEventListener(
            'scroll',
            this.getPosition.bind(this)
        )
        this.scrollEl.addEventListener(
            'resize',
            this.getPosition.bind(this)
        )
        this.scrollEl.addEventListener(
            'change',
            this.getPosition.bind(this)
        )
        window.addEventListener(
            'resize',
            this.getPosition.bind(this)
        )
        document.addEventListener(
            'click',
            this.onClick.bind(this)
        )
    }

    onClick() {
        setTimeout(() => {
            this.getPosition()
        }, 500);
    }

    getPosition() {
        const posData = this.reference.getBoundingClientRect();
        const position = {
            top: this.getTop(posData),
            left: posData.left + posData.width,
        }

        this.setPosition(position)
    }

    getTop(posData) {
        switch(this.position){
            case 'top':
                return posData.top;
            case 'middle':
                return posData.top + (posData.height / 2) - (this.target.clientHeight / 2);
            case 'down':
                return posData.top + posData.height - this.target.clientHeight;
        }
    }

    setPosition(position) {
        this.target.style.top = position.top + 'px';
        this.target.style.left = position.left + 'px';
    }
}