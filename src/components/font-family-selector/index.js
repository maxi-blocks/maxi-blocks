/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { Button, Dropdown, Spinner, Icon } = wp.components;

/**
 * Internal dependencies
 */
import { FontFamilyResolver } from '../../extensions/styles/fonts';

/**
 * External dependencies
 */
import Select from 'react-select';
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { chevronDown } from '../../icons';

/**
 * Component
 */

export default class FontFamilySelector extends Component {
    fonts = new FontFamilyResolver();

    state = {
        options: this.fonts.optionsGetter,
    };

    render() {
        const { font, onChange, className } = this.props;

        const selectFontFamilyStyles = {
            control: provided => ({
                ...provided,
                minWidth: 240,
                margin: 8,
            }),
            indicatorsContainer: () => ({
                display: 'none',
            }),
            menu: () => ({
                boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',
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
            }),
        };

        const checkout = () => {
            setTimeout(() => {
                this.setState({
                    options: this.fonts.optionsGetter,
                });
            }, 2500);
        };

        const onFontChange = newFont => {
            onChange(newFont);
            this.fonts.loadFonts(newFont.value, newFont.files);
        };

        const classes = classnames('maxi-font-family-selector', className);

        return (
            <Dropdown
                className={classes}
                renderToggle={({ isOpen, onToggle }) => (
                    <Button
                        className='maxi-font-family-selector__button'
                        onClick={onToggle}
                        aria-expanded={this.state.isVisible}
                    >
                        {font}
                        <Icon
                            className='maxi-font-family-selector__button__icon'
                            icon={chevronDown}
                        />
                    </Button>
                )}
                popoverProps={{
                    className: 'maxi-font-family-selector__popover',
                    noArrow: true,
                    position: 'middle center right',
                }}
                renderContent={() => (
                    <Fragment>
                        {!isNil(this.state.options) && (
                            <Select
                                autoFocus
                                backspaceRemovesValue={false}
                                controlShouldRenderValue={false}
                                hideSelectedOptions={false}
                                isClearable={false}
                                menuIsOpen
                                onChange={onFontChange}
                                options={this.state.options}
                                placeholder={__('Search…', 'maxi-blocks')}
                                styles={selectFontFamilyStyles}
                                tabSelectsValue={false}
                                value={font}
                                closeMenuOnSelect
                            />
                        )}
                        {isNil(this.state.options) && checkout()}
                        {isNil(this.state.options) && <Spinner />}
                    </Fragment>
                )}
            />
        );
    }
}
