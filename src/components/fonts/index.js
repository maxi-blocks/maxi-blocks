/**
 * Font Popover component
 *  
 * @version 0.1
 */

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { 
    BaseControl, 
    Popover, 
    Button,
    RadioControl,
    RangeControl,
    Dropdown,
    DropdownMenu
} = wp.components;
const { withState } = wp.compose;
const { Fragment } = wp.element;

/**
 * External dependencies
 */

import { FontFamilySelector } from '../../components/fontfamilyselector/index';

/**
 * Component
 */

export const FontPopover = ( props ) => {
    const FontPopover = withState( {
        isVisible: false,
        device: 'desktop',
        props: props
    })(( { props, isVisible, device, setState } ) => {

        const {
            classNameBaseControl,
            title,
            buttonText,
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
        } = props;
        
        const onPopoverToggle = ( ) => {
            setState( (state) => (
                { 
                    isVisible: ! state.isVisible 
                }
            ))
        };

        const onPropChange = ( ) => {
            setTimeout(() => {
                setState( ( state ) => ( 
                    console.log (state)
                ) )
            }, 1)
        }

        const onDeviceChange = (value) => {
            setState( {
                device: value
            } )
        }

        const onFocusOutside = (e) => {
            console.log ( e )
        }

        return (
            <Fragment>
                <BaseControl
                    className={classNameBaseControl ? classNameBaseControl : "gx-settings-button"}
                >
                    <BaseControl.VisualLabel>
                        { title }
                    </BaseControl.VisualLabel>
                    <Button 
                        isSecondary
                        onClick={ onPopoverToggle }
                    >
                        { buttonText ? buttonText : 'Typography' }
                    </Button>
                </BaseControl>
                { isVisible && (
                    <Popover
                        className={ classNamePopover ? classNamePopover : "gx-popover" }
                        onFocusOutside = { onFocusOutside }
                        noArrow = {true}
                    >
                        <FontFamilySelector
                            className={ classNameFontFamilySelector ? classNameFontFamilySelector : 'gx-font-family-selector' }
                            font={font}
                            onChange={onFontFamilyChange, onPropChange }
                        />
                        <RadioControl
                            className={ classNameDevice ? classNameDevice : 'gx-device-control' }
                            selected={device}
                            options={ [
                                { label: '', value: 'desktop' },
                                { label: '', value: 'tablet' },
                                { label: '', value: 'mobile' },
                            ] }
                            onChange={ ( value ) => onDeviceChange(value) }
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
                            onChange={onFontSizeUnitChange, onPropChange }
                        />
                        <RangeControl
                            label="Size"
                            className={ classNameFontSize ? classNameFontSize : 'gx-with-unit-control' }
                            value={fontSize}
                            onChange={ ( value ) => {
                                onFontSizeChange ( value );
                                setTimeout(() => {
                                    onPropChange();
                                }, 1000);
                            } }
                            min={ 0 }
                            step={0.1}
                            allowReset = {true}
                        />
                    </Popover>
                ) }
            </Fragment>
        );
    } );

    return (
        <FontPopover />
    )
}