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
            classNameBaseControl,
            title,
            buttonText,
            classNameDropdown,
            classNamePopover,
            classNameFontFamilySelector,
            font,
            onFontFamilyChange,
            classNameDevice,
            classNameFontUnit,
            fontSizeUnit,
            onFontSizeUnitChange,
            classNameFontSize,
            fontSize,
            onFontSizeChange
        } = this.props;

        return (
            <Fragment>
                <BaseControl
                    className={classNameBaseControl ? classNameBaseControl : "gx-settings-button"}
                >
                    <BaseControl.VisualLabel>
                        { title }
                    </BaseControl.VisualLabel>
                    <Dropdown
                        className={ classNameDropdown ? classNameDropdown : 'gx-fontdropdown' }
                        contentClassName="gx-font-family-selector-popover"
                        renderToggle={({ isOpen, onToggle }) => (
                            <Button
                                isSecundary
                                onClick={onToggle}
                                aria-expanded={isOpen}
                            >
                                { buttonText ? buttonText : 'Typography' }
                            </Button>
                        )}
                        popoverProps={
                            {                           
                                className: classNamePopover ? classNamePopover : "gx-popover gx-fontpopover",
                                noArrow: true,
                                position: "center"
                            }
                        }
                        renderContent={() => (
                        <Fragment>
                            <FontFamilySelector
                                className={ classNameFontFamilySelector ? classNameFontFamilySelector : 'gx-font-family-selector' }
                                font={font}
                                onChange={ onFontFamilyChange }
                            />
                            <RadioControl
                                className={ classNameDevice ? classNameDevice : 'gx-device-control' }
                                selected={this.state.device}
                                options={ [
                                    { label: '', value: 'desktop' },
                                    { label: '', value: 'tablet' },
                                    { label: '', value: 'mobile' },
                                ] }
                                onChange={ this.onDeviceChange }
                            />
                            <RadioControl
                                className={ classNameFontUnit ? classNameFontUnit : 'gx-unit-control' }
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
                                className={ classNameFontSize ? classNameFontSize : 'gx-with-unit-control' }
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
            </Fragment>
        )
    }
}
