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
const { withState } = wp.compose;
const { Fragment } = wp.element;

/**
 * External dependencies
 */

import { FontFamilySelector } from './fontfamilyselector/index';

/**
 * Component
 */

export const FontPopover = props => {

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
        } = props;

        const DeviceControl = () => {
            const DeviceControl = withState( {
                device: 'desktop',
            })(( {device, setState} ) => {

                const onDeviceChange = (value) => {
                    setState( {
                        device: value
                    } )
                }

                return (
                    <RadioControl
                        className={ classNameDevice ? classNameDevice : 'gx-device-control' }
                        selected={device}
                        options={ [
                            { label: '', value: 'desktop' },
                            { label: '', value: 'tablet' },
                            { label: '', value: 'mobile' },
                        ] }
                        onChange={ onDeviceChange }
                    />
                )
            })

            return (
                <DeviceControl />
            )
        }

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
                                onChange={onFontFamilyChange }
                            />
                            <DeviceControl />
                            <RadioControl
                                className={ classNameFontUnit ? classNameFontUnit : 'gx-unit-control' }
                                selected={ fontSizeUnit }
                                options={ [
                                    { label: 'PX', value: 'px' },
                                    { label: 'EM', value: 'em' },
                                    { label: 'VW', value: 'vw' },
                                    { label: '%', value: '%' },
                                ] }
                                onChange={onFontSizeUnitChange }
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
