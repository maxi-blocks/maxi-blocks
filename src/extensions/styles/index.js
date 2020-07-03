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
    constructor(object, meta, breakpoints) {
        this.object = object;
        this.meta = meta;
        this.breakpoints = breakpoints;

        this.init()

        console.log(this.meta)

        return this.meta;
    }

    init() {
        for (let [target, props] of Object.entries(this.object)) {
            const newEntry = {
                [target]: this.objectManipulator(props)
            };
            this.meta = Object.assign(this.meta, newEntry);

            // Alternative
            // this.meta[target] = this.objectManipulator(props);
        }
    }

    objectManipulator(props) {
        let response = {
            breakpoints: this.breakpoints,
            content: {}
        };

        for (let [key, value] of Object.entries(props)) {
            let newObject = {};

            for (let breakpoint of Object.keys(value)) {
                if (breakpoint != 'label')
                    newObject = this.propsObjectManipulator(value, newObject, breakpoint);
            }

            // newObject = this.propsObjectManipulator(value, newObject, 'general');
            // newObject = this.propsObjectManipulator(value, newObject, 'l');
            // newObject = this.breakpointsObjectManipulator(props, newObject, key, 'breakpoints');

            // On Typography component object
            // if (props[key].font) {
            //     newObject.font = props[key].font;
            //     newObject.options = props[key].options;
            // }

            // if(!isEmpty(newObject))
            //     console.log(newObject)

            if (!isNil(newObject))
                Object.assign(response.content, { [props[key].label]: newObject })
        }

        // console.log(response)

        return response;
    }

    propsObjectManipulator(value, newObject, breakpoint) {
        if (isNil(value[breakpoint]))
            return newObject;

        const object = value[breakpoint];
        newObject[breakpoint] = {};
        let unitChecker = '';
        let unit = value.unit ? value.unit : '';

        for (let [target, prop] of Object.entries(object)) {
            if (isNil(prop)) {
                console.error(`Undefined property. Property: ${target}`);
                return;
            }
            // values with dimensions
            if (
                isNumber(prop) ||
                unitChecker.indexOf(target) == 0 && !isEmpty(prop)
            )
                newObject[breakpoint][target] = prop + unit;
            // avoid numbers with no related metric
            if (unitChecker.indexOf(target) == 0)
                unit = '';
            // values with metrics
            if (prop.length <= 2 && !isEmpty(prop))
                unitChecker = target, unit = prop;
            // values with strings
            if (prop.length > 2)
                newObject[breakpoint][target] = prop;
        }

        return newObject;
    }

    breakpointsObjectManipulator(props, newObject, key, type) {
        if (isNil(props[key][type]))
            return newObject;

        newObject.breakpoints = { ...props[key][type] };

        return newObject;
    }
}

/**
 * Responsive Backend Styles resolver
 */
export class BackEndResponsiveStyles {
    constructor(meta) {
        this.meta = meta;
        // Uses serverside loaded inline css
        this.target = document.getElementById('maxi-blocks-inline-css');
        !isNil(this.meta) ?
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
        let response = '';
        for (let [target, prop] of Object.entries(this.meta)) {
            target = this.getTarget(target);
            const breakpoints = prop.breakpoints;

            for (let value of Object.values(prop.content)) {
                for (let [breakpoint, content] of Object.entries(value)) {
                    if (breakpoint === 'font' || breakpoint === 'options')
                        break;  // Is needed to fix font from typography!

                    if (breakpoint === 'general') {
                        response += `.${target}{`;
                        response += this.getResponsiveStyles(content);
                        response += '}';
                    }
                    else {
                        response += `@media only screen and (max-width: ${breakpoints[breakpoint]}px){.${target}{`;
                        response += this.getResponsiveStyles(content);
                        response += '}}';
                    }
                }

                // if (!isNil(value.breakpoints)) {
                //     for (let breakpoint of Object.values(value.breakpoints)) {
                //         content += `@media only screen and (${breakpoint.rule}){.${target}{${breakpoint.content}}}`;
                //     }
                // }
            }
        }

        // console.log(response)

        return response;
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