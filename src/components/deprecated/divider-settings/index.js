/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;
/**
 * Internal dependencies
 */
import { GXComponent } from '../../index';
import CheckBoxControl from '../../checkbox-control';
import ColorControl from '../../color-control';
import SizeControl from '../../size-control';

/**
 * External dependencies
 */
import {
    isNil,
    isEmpty,
    isNumber
} from 'lodash';
import classnames from 'classnames';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
export class DividerSettings extends GXComponent {
    target = this.props.target ? this.props.target : 'gx-divider';

    componentDidMount() {
        const value = typeof this.props.dividerSettings === 'object' ? this.props.dividerSettings : JSON.parse(this.props.dividerSettings);
        this.saveAndSend(value)
    }

    get getObject() {
        return this.getStylesObject;
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isNil(this.object.isHidden)) {
            if (this.object.isHidden)
                response.general.display = 'none';
        }
        if (!isNil(this.object.isRounded)) {
            if (this.object.isRounded)
                response.general['border-radius'] = '2rem';
        }
        if (!isNil(this.object.dividerAlignment)) {
            switch (this.object.dividerAlignment) {
                case 'left':
                    response.general['margin-left'] = "0px";
                    break;
                case 'center':
                case 'justify':
                    // response.general['margin-left'] = "auto";
                    // response.general['margin-right'] = "auto";
                    null
                    break;
                case 'right':
                    response.general['margin-right'] = "0px";
                    break;
            }
        }
        if (!isEmpty(this.object.dividerOrder)) {
            response.general.order = this.object.dividerOrder;
        }
        if (!isEmpty(this.object.dividerColor)) {
            response.general['background-color'] = this.object.dividerColor;
        }
        if (isNumber(this.object.sizeSettings['width'])) {
            response.general['widthUnit'] = this.object.sizeSettings['widthUnit'];
        }
        if (isNumber(this.object.sizeSettings['width'])) {
            response.general['width'] = this.object.sizeSettings['width'];
        }
        if (isNumber(this.object.sizeSettings['height'])) {
            response.general['heightUnit'] = this.object.sizeSettings['heightUnit'];
        }
        if (isNumber(this.object.sizeSettings['height'])) {
            response.general['height'] = this.object.sizeSettings['height'];
        }
        return response;
    }

    render() {
        const { dividerSettings } = this.props;

        let value = typeof dividerSettings === 'object' ? dividerSettings : JSON.parse(dividerSettings);

        const Line = () => <hr style={{ marginTop: "28px" }} />;

        const onVerticalChange = val => {
            value.isVertical = val;
            const temp = {
                widthUnit: value.sizeSettings.widthUnit,
                width: value.sizeSettings.width,
                heightUnit: value.sizeSettings.heightUnit,
                height: value.sizeSettings.height,
            }
            value.sizeSettings.widthUnit = temp.heightUnit;
            value.sizeSettings.width = temp.height;
            value.sizeSettings.heightUnit = temp.widthUnit;
            value.sizeSettings.height = temp.width;
            this.saveAndSend(value, false);
        }

        return (
            <Fragment>
                <CheckBoxControl
                    label={__('Hide Divider', 'gutenberg-extra')}
                    id='gx-new-window'
                    checked={value.isHidden}
                    onChange={val => {
                        value.isHidden = val;
                        this.saveAndSend(value);
                    }}
                />
                {/* Is really necessary? vvvv */}
                <CheckBoxControl
                    label={__('Vertical Divider', 'gutenberg-extra')}
                    id='gx-new-window'
                    checked={value.isVertical}
                    onChange={onVerticalChange}
                />
                <CheckBoxControl
                    label={__('Rounded Divider', 'gutenberg-extra')}
                    id='gx-new-window'
                    checked={value.isRounded}
                    onChange={val => {
                        value.isRounded = val;
                        this.saveAndSend(value);
                    }}
                />
                <CheckBoxControl
                    label={__('Additional Divider', 'gutenberg-extra')}
                    id='gx-new-window'
                    checked={value.isMultiple}
                    onChange={val => {
                        value.isMultiple = val;
                        this.saveAndSend(value);
                    }}
                />
                <Line />
                {/** May an AligmentControl would be better vvvv */}
                <SelectControl
                    label={__('Divider Alignment', 'gutenberg-extra')}
                    className="gx-block-style components-base-control divider-alignment"
                    value={value.dividerAlignment}
                    options={[
                        { label: __('Left'), value: 'left' },
                        { label: __('Center'), value: 'center' },
                        { label: __('Right'), value: 'right' },
                    ]}
                    onChange={val => {
                        value.dividerAlignment = val;
                        this.saveAndSend(value);
                    }}
                />
                <SelectControl
                    label={__('Divider Position', 'gutenberg-extra')}
                    className="gx-block-style"
                    value={value.dividerOrder}
                    options={[
                        { label: __('After Title'), value: 1 },
                        { label: __('Before Title'), value: 0 },
                        { label: __('Before Subtitle'), value: -1 },
                        { label: __('After Description'), value: 4 },
                        { label: __('Behind Subtitle'), value: 'behind-subtitle' },
                        { label: __('Preappended to Subtitle'), value: 'preappend-subtitle' },
                        { label: __('Appended to Subtitle'), value: 'appended-subtitle' },
                    ]}
                    onChange={val => {
                        value.dividerOrder = val;
                        this.saveAndSend(value);
                    }}
                />
                <Line />
                <SizeControl
                    label={__('Width', 'gutenberg-extra')}
                    unit={value.sizeSettings.widthUnit}
                    onChangeUnit={val => {
                        value.sizeSettings.widthUnit = val;
                        this.saveAndSend(value)
                    }}
                    value={value.sizeSettings.width}
                    onChangeValue={val => {
                        value.sizeSettings.width = val;
                        this.saveAndSend(value)
                    }}
                />
                <SizeControl
                    label={__('Height', 'gutenberg-extra')}
                    unit={value.sizeSettings.heightUnit}
                    onChangeUnit={val => {
                        value.sizeSettings.heightUnit = val;
                        this.saveAndSend(value)
                    }}
                    value={value.sizeSettings.height}
                    onChangeValue={val => {
                        value.sizeSettings.height = val;
                        this.saveAndSend(value)
                    }}
                />
                <Line />
                <ColorControl
                    label={__('Color', 'gutenberg-extra')}
                    color={value.dividerColor}
                    defaultColor={value.defaultDividerColor}
                    onColorChange={val => {
                        value.dividerColor = val;
                        this.saveAndSend(value)
                    }}
                    disableGradient
                />
            </Fragment>
        )
    }
}

export const Divider = props => {
    const { 
        dividerSettings,
        className
    } = props;

    const value = typeof dividerSettings === 'object' ? dividerSettings : JSON.parse(dividerSettings);
    let classes = classnames('gx-divider-wrapper', className);
    if (value.isMultiple)
        classes = classnames(classes, 'is-multiple');
    if (value.isVertical)
        classes = classnames(classes, 'is-vertical')

    return (
        <div className={classes}>
            <hr
                className="gx-divider"
            />
            {
                value.isMultiple ?
                    <hr
                        className="gx-divider"
                    /> :
                    null
            }
        </div>
    )
}