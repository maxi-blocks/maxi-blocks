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
import { getDefaultProp } from '../styles/utils';

/**
 * External dependencies
 */
import {
    isEmpty,
    uniqueId,
    isEqual,
    isNil,
    isObject
} from 'lodash';

/**
 * Class
 */
class GXBlock extends GXComponent {
    state = {
        styles: {},
    }

    constructor() {
        super(...arguments);
        this.uniqueIDChecker(this.props.attributes.uniqueID);
        this.fixProps();
    }

    fixProps() {
        Object.entries(this.props.attributes).map(([key, value]) => {
            let obj;
            try {
                obj = JSON.parse(value);
            } catch (error) {
                return;
            }

            if (!isObject(obj))
                return;

            const defaultObj = JSON.parse(getDefaultProp(this.props.clientId, key));

            const objKeys = Object.keys(obj).sort();
            const defaultObjKeys = Object.keys(defaultObj).sort();
            if (JSON.stringify(objKeys) != JSON.stringify(defaultObjKeys)) {
                const newObject = this.generalToDesktop(obj, defaultObj);
                this.props.setAttributes({ [key]: JSON.stringify(newObject) });
                this.props.attributes[key] = JSON.stringify(newObject);
            }
        })
    }

    generalToDesktop(obj, defaultObj) {
        if (obj.hasOwnProperty('general') && !obj.hasOwnProperty('desktop'))
            defaultObj.desktop = obj.general;

        return defaultObj;
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

    get getObject() {
        return null;
    }

    metaValue() {
        const obj = this.getObject;

        if (isEqual(obj, this.state.styles))
            return null;

        this.setState({
            styles: obj
        })

        return new ResponsiveStylesResolver(obj);
    }

    /** 
    * Refresh the styles on Editor
    */
    displayStyles() {
        const newMeta = this.metaValue();

        if (isNil(newMeta) || isEqual(this.getMeta, newMeta))
            return;

        this.saveMeta(newMeta);
    }

    removeStyle(target = this.props.attributes.uniqueID) {
        let cleanMeta = { ...this.getMeta };
        Object.keys(this.getMeta).map(key => {
            if (key.indexOf(target) >= 0)
                delete cleanMeta[key]
        })

        this.saveMeta(cleanMeta)
    }

    saveMeta(newMeta) {
        const post = select('core/editor').getCurrentPost();
        const id = post.id;
        const type = post.type;

        dispatch('core').editEntityRecord(
            'postType',
            type,
            id,
            {
                meta: {
                    _gutenberg_extra_responsive_styles: JSON.stringify(newMeta)
                }
            },
            {
                undoIgnore: true
            }
        )
            .then(new BackEndResponsiveStyles(newMeta))
            .catch(err => console.error(err))
    }
}

export default GXBlock;