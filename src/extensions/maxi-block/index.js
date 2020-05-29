/**
 * Maxi Blocks Block component extension
 * 
 * @todo Comment properly
 */

/**
* WordPress dependencies
*/
const {
    dispatch,
    select,
} = wp.data;

/**
 * Internal dependencies
 */
import GXComponent from '../maxi-component';
import { 
    ResponsiveStylesResolver,
    BackEndResponsiveStyles
} from '../styles';

/**
 * External dependencies
 */
import {
    isEmpty,
    uniqueId,
} from 'lodash';

/**
 * Class
 */
class GXBlock extends GXComponent {

    constructor() {
        super(...arguments);
        this.test = wp.data.select('gx').receiveGXStyles(); // API test
        this.uniqueIDChecker(this.props.attributes.uniqueID)
    }

    componentDidMount() {
        this.displayStyles();
    }

    componentDidUpdate() {
        this.displayStyles();
    }

    componentWillUnmount() {
        this.removeStyle();
    }

    uniqueIDChecker(idToCheck) {
        if (!isEmpty(document.getElementsByClassName(idToCheck))) {
            const newUniqueId = uniqueId(idToCheck.replace(idToCheck.match(/(\d+)(?!.*\d)/)[0], ''));

            this.uniqueIDChecker(newUniqueId);

            this.props.setAttributes({ uniqueID: newUniqueId })
        }
    }

    get getMeta() {
        let meta = select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles;
        return meta ? JSON.parse(meta) : {};
    }

    /**
     * Retrieve the target for responsive CSS 
     * 
     * @todo check if it worth with this new system
     */
    get getTarget() {
        return this.props.attributes.uniqueID;
    }

    get getObject() {
        return null;
    }

    /**
    * Creates a new object that 
    *
    * @param {string} target	Block attribute: uniqueID
    * @param {obj} meta		Old and saved metadate
    * @param {obj} value	New values to add
    */
    metaValue(type = null) {
        this.type = type || '';

        const styleTarget = this.getTarget;
        const obj = this.getObject;

        const responsiveStyle = new ResponsiveStylesResolver(styleTarget, obj);
        const response = JSON.stringify(responsiveStyle.newMeta);

        return response;
    }

    /** 
    * Refresh the styles on Editor
    */
    displayStyles() {
        this.saveMeta();
        new BackEndResponsiveStyles(this.getMeta);
    }

    saveMeta(type) {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(type),
            },
        });
    }

    removeStyle(target = this.props.attributes.uniqueID) {
        let cleanMeta = { ...this.getMeta };
        Object.keys(this.getMeta).map(key => {
            if (key.indexOf(target) >= 0)
                delete cleanMeta[key]
        })

        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: JSON.stringify(cleanMeta),
            },
        })
            .then(() => new BackEndResponsiveStyles(this.getMeta));
    }
}

export default GXBlock;