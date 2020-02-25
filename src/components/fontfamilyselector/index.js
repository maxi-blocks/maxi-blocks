/**
 * Font Family component
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
 * Component
 */

export const FontFamily = (props) => {

    const {
        font,
        onChange
    } = props;

    let isOpen = false;
    let options = [];

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
        menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' })
    };

    const getFontFamilyOptions = (data) => {
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

    // TESTING
    const loadFonts = (font, files) => {
        if ( document.fonts ) {
            // Object.values(files).map( e => {
            //     const fontLoad = new FontFace( font, `url(${e})`);
            //     document.fonts.add( fontLoad )
            //     fontLoad.load();
            //     fontLoad.loaded.then ( (result) => {
            //         console.log ( result )
            //     })
            // })
            Object.entries(files).map ( variant => {
                const style = getFontStyle( variant[0] );
            })
            // const notoSansRegular = new FontFace( font, `url(https://fonts.googleapis.com/css?family=${font})`);
            // document.fonts.add(notoSansRegular);
            // console.info('Current status', notoSansRegular.status);
            // notoSansRegular.load();
            // console.info('Current status', notoSansRegular.status);
            // notoSansRegular.loaded.then( (result) => {
            //     console.log ( result )
            // })
        }
    }

    const getFontStyle = ( variant ) => {
        console.log ( variant.charAt( 0 ) )
        switch ( variant.charAt( 0 ) ) {
            
        }
    }

    return (
        <Fragment>
            <Dropdown
                className='gx-font-family-selector'
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
                            onChange={ newFont => {
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