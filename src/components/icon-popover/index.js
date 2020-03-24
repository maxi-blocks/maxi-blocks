/**
 * DEPRECATED
 */

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

import * as fa from 'react-icons/fa';
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

/**
 * Component
 */

export default class IconPopover extends Component {

    constructor ( ) {
        super(...arguments);
    }


    render () {
        const {
            className,
            classNamePopover = "gx-popover",
            title = __('Icons', 'gutenberg-extra'),
        } = this.props;

        return (
            <div className={className}>
                <BaseControl
                    className={"gx-settings-button"}
                >
                    <BaseControl.VisualLabel className={"gx-icondropdown-label"}>
                        { title }
                    </BaseControl.VisualLabel>
                    <Dropdown
                        className={ 'gx-icondropdown' }
                        renderToggle={({ isOpen, onToggle }) => (
                            <Button
                              isSecundary
                              onClick={onToggle}
                              aria-expanded={isOpen}
                            >
                              { title }
                            </Button>
                        )}
                        popoverProps={
                            {
                                className: classNamePopover,
                                noArrow: true,
                                position: "center"
                            }
                        }
                        renderContent={() => (
                        <Fragment>
                            <div><fa.Fa500Px/></div>
                        </Fragment>
                        )}
                    >
                    </Dropdown>
                </BaseControl>
            </div>
        )
    }
}
