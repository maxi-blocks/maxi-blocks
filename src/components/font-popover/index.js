/**
 * Font Popover component
 *  
 * @version 0.1
 */

/**
 * Styles
 */

import './editor.scss';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { 
    BaseControl, 
    Button,
    RadioControl,
    RangeControl,
    Dropdown,
} = wp.components;
const { 
    Fragment, 
    Component 
} = wp.element;

/**
 * External dependencies
 */

import FontFamilySelector from '../font-family-selector/index';

/**
 * Component
 */

export default class FontPopover extends Component {

    constructor ( ) {
        super(...arguments);
        this.onDeviceChange = this.onDeviceChange.bind( this );
    }

    state = {
        device: 'desktop'
    }

    onDeviceChange ( value ) {
        this.setState (
            {device: value}
        )
    }

    render () {
        const {
            className,
            classNamePopover,
            title,
            buttonText,
            font,
            onFontFamilyChange,
            fontSizeUnit,
            onFontSizeUnitChange,
            fontSize,
            onFontSizeChange
        } = this.props;

        return (
            <div className={className}>
                <BaseControl
                    className={"gx-settings-button"}
                >
                    <BaseControl.VisualLabel>
                        { title }
                    </BaseControl.VisualLabel>
                    <Dropdown
                        className={ 'gx-fontdropdown' }
                        renderToggle={({ isOpen, onToggle }) => (
                            <Button
                                isSecundary
                                onClick={onToggle}
                                aria-expanded={isOpen}
                            >
                                { buttonText ? buttonText : __('Typography', 'gutenberg-extra') }
                            </Button>
                        )}
                        popoverProps={
                            {                           
                                className: classNamePopover + " gx-popover gx-fontpopover",
                                noArrow: true,
                                position: "center"
                            }
                        }
                        renderContent={() => (
                        <Fragment>
                            <FontFamilySelector
                                className={'gx-font-family-selector' }
                                font={font}
                                onChange={ onFontFamilyChange }
                            />
                            <RadioControl
                                className={ 'gx-device-control' }
                                selected={this.state.device}
                                options={ [
                                    { label: '', value: 'desktop' },
                                    { label: '', value: 'tablet' },
                                    { label: '', value: 'mobile' },
                                ] }
                                onChange={ this.onDeviceChange }
                            />
                            <RadioControl
                                className={ 'gx-unit-control' }
                                selected={ fontSizeUnit }
                                options={ [
                                    { label: 'PX', value: 'px' },
                                    { label: 'EM', value: 'em' },
                                    { label: 'VW', value: 'vw' },
                                    { label: '%', value: '%' },
                                ] }
                                onChange={ onFontSizeUnitChange }
                            />
                            <RangeControl
                                label="Size"
                                className={ 'gx-with-unit-control' }
                                value={fontSize}
                                onChange={ onFontSizeChange }
                                min={ 0 }
                                step={0.1}
                                allowReset = {true}
                            />
                        </Fragment>
                        )}
                    >
                    </Dropdown>
                </BaseControl>
            </div>
        )
    }
}
