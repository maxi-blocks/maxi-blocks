/**
 * Font Family Selector component
 *  
 * @version 0.1
 */

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { Button, Popover, Spinner } = wp.components;
const { Component } = wp.element;


/**
 * External dependencies
 */

import './editor.scss';
import { ChevronDown } from './icons';
import Select from 'react-select';
import { isNil } from 'lodash';

/**
 * Component
 */

export default class FontFamilySelector extends Component {

    constructor ( ) {
        super(...arguments);
        this.onToggle = this.onToggle.bind ( this );
        this.fonts = new FontFamilyResolver();
    }

    state = {
        isVisible: false,
        options: ''
    }

    onToggle () {
        this.setState ( (state) => ({
            isVisible: ! state.isVisible,
            options: this.fonts.optionsGetter
        }))
    }

    checkout () {
        setTimeout(() => {
            this.setState ( {
                options: this.fonts.optionsGetter
            })
        }, 500);
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
            <div className={className}>
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
                                { ! isNil (this.state.options ) && 
                                    <Select
                                        autoFocus
                                        backspaceRemovesValue={false}
                                        controlShouldRenderValue={false}
                                        hideSelectedOptions={false}
                                        isClearable={false}
                                        menuIsOpen
                                        onChange={newFont => {
                                            onChange(newFont.value);
                                            this.fonts.loadFonts(newFont.value, newFont.files);
                                        }}
                                        options={
                                            this.state.options
                                        }
                                        placeholder={__("Search...", 'gutenberg-extra')}
                                        styles={selectFontFamilyStyles}
                                        tabSelectsValue={false}
                                        value={font}
                                        closeMenuOnSelect={true}
                                    />
                                }
                                { isNil (this.state.options )
                                    && this.checkout()
                                }
                                { isNil (this.state.options) &&
                                    <Spinner />
                                }
                            </div>
                        </Popover>
                    ) }
                </Button>
            </div>
        )
    }
}