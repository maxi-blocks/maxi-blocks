/**
 * Font Family Selector component
 *  
 * @version 0.1
 */

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { Button, Popover } = wp.components;
const { Component } = wp.element;


/**
 * External dependencies
 */

import './editor.scss';
import { ChevronDown } from './icons';
import Select from 'react-select';
import fonts from '../../../customizer/dist/fonts.json';
import { getFontFamilyOptions, loadFonts } from '../../includes/utils/utils';

/**
 * Component
 */

export default class FontFamilySelector extends Component {

    constructor ( ) {
        super(...arguments);
        this.onToggle = this.onToggle.bind ( this );
    }

    state = {
        isVisible: false,
    }

    onToggle () {
        this.setState ( (state) => ({
            isVisible: ! state.isVisible
        }))
    }

    render () {

        const {
            font,
            onChange,
            className
        } = this.props;

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
            }),
            menuList: () => ({
                maxHeight: '300px',
                overflowY: 'auto',
                paddingBottom: '4px',
                paddingTop: '4px',
                position: 'relative',
                webkitOverflowScrolling: 'touch',
                boxSizing: 'border-box',
                overflowX: 'hidden',
            })
        };

        return (
            <Button
                className='gx-font-family-selector-button'
                onClick={this.onToggle}
                aria-expanded={this.state.isVisible}
            >
                { font }
                <ChevronDown />
                { this.state.isVisible && (
                    <Popover
                        className="gx-font-family-selector-popover"
                        noArrow={true}
                    >
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
                                    loadFonts(newFont.value, newFont.files);
                                }}
                                options={getFontFamilyOptions(fonts)}
                                placeholder={__("Search...", 'gutenberg-extra')}
                                styles={selectFontFamilyStyles}
                                tabSelectsValue={false}
                                value={font}
                                closeMenuOnSelect={true}
                            />
                        </div>
                    </Popover>
                ) }
            </Button>
        )
    }
}