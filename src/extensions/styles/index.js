/**
* WordPress dependencies
*/
const { select } = wp.data;

/**
 * External dependencies
 */
import {
    isNil,
    isNumber,
    isEmpty
} from 'lodash';

/**
 * Responsive Frontend Styles resolver
 * Creates a new object ready to deliver responsive styles on frontend
 *
 * @todo    Comment and extend documentation
 */
export class ResponsiveStylesResolver {
    constructor(target, object) {
        this.target = target;
        this.object = object;
        this.meta = this.oldMeta;
        this.newObject = this.objectManipulator;
    }

    get oldMeta() {
        let meta = select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles;
        return meta ? JSON.parse(meta) : {};
    }

    get objectManipulator() {
        let response = {};

        for (let key of Object.keys(this.object)) {
            let newObject = {};

            newObject = this.propsObjectManipulator(newObject, key, 'general');
            newObject = this.propsObjectManipulator(newObject, key, 'desktop');
            newObject = this.propsObjectManipulator(newObject, key, 'tablet');
            newObject = this.propsObjectManipulator(newObject, key, 'mobile');
            // On Typography component object
            if (this.object[key].font) {
                newObject.font = this.object[key].font;
                newObject.options = this.object[key].options;
            }

            Object.assign(response, { [this.object[key].label]: newObject })

        }

        return response;
    }

    propsObjectManipulator(newObject, key, device) {
        if (typeof this.object[key][device] === 'undefined') {
            return newObject;
        }
        const object = this.object[key][device];
        if (device === 'general')
            device = 'desktop'
        if (typeof newObject[device] === 'undefined')
            newObject[device] = {};
        let unitChecker = '';
        let unit = this.object[key].unit ? this.object[key].unit : '';

        for (let [target, prop] of Object.entries(object)) {
            if (isNil(prop)) {
                console.error(`Undefined property. Property: ${this.target}`);
                return;
            }
            // values with dimensions
            if (
                isNumber(prop) ||
                unitChecker.indexOf(target) == 0 && !isEmpty(prop)
            )
                newObject[device][target] = prop + unit;
            // avoid numbers with no related metric
            if (unitChecker.indexOf(target) == 0)
                unit = '';
            // values with metrics
            if (prop.length <= 2 && !isEmpty(prop))
                unitChecker = target, unit = prop;
            // values with strings
            if (prop.length > 2)
                newObject[device][target] = prop;
        }

        return newObject;
    }

    get newMeta() {
        if (Object.entries(this.meta).length > 0 && this.meta.hasOwnProperty(this.target))
            this.meta[this.target] = this.newObject;
        else {
            const newEntry = {
                [this.target]: this.newObject
            };

            this.meta = Object.assign(this.meta, newEntry);
        }

        return this.meta;
    }

}

/**
 * Responsive Backend Styles resolver
 *
 * @version 0.2
 */
export class BackEndResponsiveStyles {
    constructor(meta) {
        this.meta = meta;
        // Uses serverside loaded inline css
        this.target = document.getElementById('maxi-blocks-inline-css');
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
        style.id = 'maxi-blocks-inline-css';
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
        if (target.indexOf('__$:') != -1)
            return target.replace('__$', '');
        if (target.indexOf('__$>') != -1)
            return target.replace('__$', '');
        if (target.indexOf('__$#') != -1)
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