/**
 * Font Family Selector component
 *  
 * @version 0.1
 */

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { Dropdown, Button } = wp.components;
const { Fragment } = wp.element;


/**
 * External dependencies
 */

import './editor.scss';
import { ChevronDown } from './icons.js';
import Select from 'react-select';
import fonts from '../../../customizer/dist/fonts.json';

/**
 * Functions
 */

/**
 * Get font families from GFonts JSON file
 * 
 * @param {JSON} data Recibes JSON data with the fonts variants and properties
 * @returns {array} Options ready for React-Select 
 */

const getFontFamilyOptions = (data) => {
    let options = [];
    let items = data.items;
    items.map(item => {
        options.push({
            label: item.family,
            value: item.family,
            files: item.files
        });
    });
    return options;
}

/**
 * Loads the font on background using JS FontFace API
 * 
 * @param {string} font Name of the selected font
 * @param {obj} files Different variations of the font
 */

const loadFonts = (font, files) => {
    // Avoid reloading fonts already load
    for (var fontFace of document.fonts.values()) {
        if ( fontFace.family === font ) {
            return;
        }
    }
    if (document.fonts) {   // FontFace API
        Object.entries(files).map(variant => {
            const style = getFontStyle(variant[0]);
            const fontLoad = new FontFace(font, `url(${variant[1]})`, style);
            document.fonts.add(fontLoad);
            fontLoad.loaded.catch((err) => {
                console.info(__(`Font hasn't been able to download: ${err}`))
            })
        })
    }
}

/**
 * Prepares the styles to be ready for JS FontFace API
 * 
 * @param {obj} variant Concrete variant of the font with name and url
 * @returns {obj} Styles options for load the font on FontFace API
 */

const getFontStyle = (variant) => {
    const styles = variant.split(/([0-9]+)/).filter(Boolean);
    if (styles.length > 1) {
        return {
            style: `${styles[1]}`,
            weight: `${styles[0]}`
        };
    } else {
        const regExp = new RegExp('([0-9]+)', 'gm');
        if (styles[0].search(regExp) >= 0) {  // number
            return { weight: `${styles[0]}` };
        } else {
            return { style: `${styles[0]}` };
        }
    }
}

/**
 * Loads the saved fonts everytime the block is load. 
 * 
 * @param {array} blockFonts List with the saved fonts on the block
 */

export const fontFamilyinit = ( fontsEx ) => {
    const fontFamilyList = getFontFamilyOptions( fonts );
    fontsEx.map ( selectFont => {
        fontFamilyList.forEach( e => {
            if ( e.label === selectFont ) {
                loadFonts ( e.label, e.files );
            }
        })
    })
}

/**
 * Component
 */

export const FontFamilySelector = (props) => {

    const {
        font,
        onChange,
        className
    } = props;

    let isOpen = false;

    const onToggle = () => {
        isOpen = !isOpen;
    }

    const selectFontFamilyStyles = {
        control: provided => ({
            ...provided,
            minWidth: 240,
            margin: 8,
        }),
        indicatorsContainer: () => ({
            display: 'none'
        }),
        menu: () => ({ 
            boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' 
        })
    };

    return (
        <Fragment>
            <Dropdown
                className={className}
                contentClassName="gx-font-family-selector-popover"
                renderToggle={({ isOpen, onToggle }) => (
                    <Button
                        className='gx-font-family-selector-button'
                        onClick={onToggle}
                        aria-expanded={isOpen}
                    >
                        {font}
                        <ChevronDown />
                    </Button>
                )}
                renderContent={() => (
                    <div className="gx-font-family-selector-content">
                        <Select
                            autoFocus
                            backspaceRemovesValue={false}
                            controlShouldRenderValue={false}
                            hideSelectedOptions={false}
                            isClearable={false}
                            menuIsOpen
                            onChange={newFont => {
                                onChange(newFont.value);
                                onToggle;
                                loadFonts(newFont.value, newFont.files);
                            }}
                            options={getFontFamilyOptions(fonts)}
                            placeholder="Search..."
                            styles={selectFontFamilyStyles}
                            tabSelectsValue={false}
                            value={font}
                            closeMenuOnSelect={true}
                        />
                    </div>
                )}
            >
            </Dropdown>
        </Fragment>
    )
}