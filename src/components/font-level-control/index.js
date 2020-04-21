/**
 * Wordpress dependencies
 */
const {	SelectControl } = wp.components;
const { Component } = wp.element;
const {
    dispatch,
    select
} = wp.data;

/**
 * Internal dependencies
 */
import { DefaultTypography } from '../index';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { 
    isNil,
    isEmpty
} from 'lodash';

/**
 * Block
 */
export default class FontLevelControl extends Component {
    state = {
        target: this.props.target ? this.props.target : '',
        lastLevel: this.props.value,
        p: {},
        h1: {},
        h2: {},
        h3: {},
        h4: {},
        h5: {},
        h6: {}
    }

    /**
    * Retrieves the old meta data
    */
    get getMeta() {
        let meta = select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles;
        return meta ? JSON.parse(meta) : {};
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        let styleTarget = select('core/block-editor').getBlockAttributes(select('core/block-editor').getSelectedBlockClientId()).uniqueID;
        styleTarget = `${styleTarget}${this.state.target.length > 0 ? `__$${this.state.target}` : ''}`;
        return styleTarget;
    }

    /**
    * Creates a new object that 
    *
    * @param {string} target	Block attribute: uniqueID
    * @param {obj} meta		Old and saved metadate
    * @param {obj} value	New values to add
    */
    metaValue(fontOptResponse) {
        const meta = this.getMeta;
        const styleTarget = this.getTarget;
        const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, fontOptResponse);
        const response = JSON.stringify(responsiveStyle.getNewValue);
        return response;
    }

    /**
    * Saves and send the data. Also refresh the styles on Editor
    */
    saveAndSend(value, fontOptResponse) {
        this.props.onChange(value, JSON.stringify(fontOptResponse));
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(fontOptResponse),
            },
        });
        new BackEndResponsiveStyles(this.getMeta);
    }

    render() {
        {
            const {
                label,
                className = 'gx-title-level',
                value,
                fontOptions,
                disableP = false,
                disableH1 = false,
                disableH2 = false,
                disableH3 = false,
                disableH4 = false,
                disableH5 = false,
                disableH6 = false,
            } = this.props;

            const {
                lastLevel
            } = this.state;
        
            let classes = classnames('gx-title-level');
            if(className)
                classes = classnames(classes, className);
        
            const getOptions = () => {
                let response = [];
                if(!disableP)
                    response.push({ label: 'Paragraph', value: 'p'})
                if(!disableH1)
                    response.push({ label: 'H1', value: 'h1' })
                if(!disableH2)
                    response.push({ label: 'H2', value: 'h2' })
                if(!disableH3)
                    response.push({ label: 'H3', value: 'h3' })
                if(!disableH4)
                    response.push({ label: 'H4', value: 'h4' })
                if(!disableH5)
                    response.push({ label: 'H5', value: 'h5' })
                if(!disableH6)
                    response.push({ label: 'H6', value: 'h6' })
                return response;
            }
            const onChangeValue = value => {
                saveOldTypography(value);
                let fontOptResponse = {};
                if(!isEmpty(this.state[value]))
                    fontOptResponse = this.state[value];
                else if(!isNil(fontOptions)) {
                    const oldFontOptions = typeof fontOptions === 'object' ? fontOptions : JSON.parse(fontOptions);
                    fontOptResponse.label = oldFontOptions.label;
                    Object.assign(fontOptResponse, DefaultTypography[value]);
                }
                this.saveAndSend(value, fontOptResponse)
            }

            const saveOldTypography = value => {
                this.setState({
                    [lastLevel]: typeof fontOptions === 'object' ? fontOptions : JSON.parse(fontOptions),
                    lastLevel: value
                })
            }
        
            return (
                <SelectControl
                    label={label}
                    className={classes}
                    value={value}
                    options={getOptions()}
                    onChange={onChangeValue}
                />
            )
        }
    }
}
