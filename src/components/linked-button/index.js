/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { getScrollContainer } = wp.dom;
const { Button } = wp.components;
const { Component } = wp.element;
const {
    RichText,
    __experimentalLinkControl
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import { PopoverControl } from '../popover';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';
import './style.scss';
import iconsSettings from '../icons/icons-settings';

/**
 * Block
 */
export default class LinkedButton extends Component {

    state= {
        uniqueHash: (Math.random() * 10000).toFixed(0)
    }

    componentDidMount() {
        this.popoverPosition();
    }

    popoverPosition() {
        const target = document.querySelector(`.gx-externalbutton-unique-${this.state.uniqueHash} .gx-externalbutton-popover`);
        const reference = document.querySelector(`button.gx-externalbutton-unique-${this.state.uniqueHash}`);
        const scrollEl = getScrollContainer(target);
        if (isNil(target) || isNil(reference)) {
            return;
        }
        new FixObjectFollower(target, reference, scrollEl, 'down');
    }

    render() {
        const {
            className,
            placeholder = __('External link', 'gutenberg-extra'),
            buttonText,
            onTextChange,
            externalLink,
            onLinkChange,
            settings = [
                {
                    id: 'opensInNewTab',
                    title: __('Open in new tab', 'gutenberg-extra')
                }
            ],
        } = this.props;

        const { uniqueHash } = this.state;

        const value = typeof externalLink === 'object' ? externalLink : JSON.parse(externalLink);

        let classes = classnames(`gx-externalbutton-control gx-externalbutton-unique-${uniqueHash}`);
        if(className)
            classes = classnames(classes, className);

        return (
            <Button
                className={classes}
            >
                <RichText
                    tagName="span"
                    className="gx-externalbutton-richtext"
                    placeholder={placeholder}
                    value={buttonText}
                    onChange={val => onTextChange(val)}
                />
                <PopoverControl
                    className="gx-externalbutton-popover"
                    popovers={[
                        {
                            content: (
                                <__experimentalLinkControl
                                    className="gx-image-box-read-more-link"
                                    value={value}
                                    onChange={val => onLinkChange(val)}
                                    settings={settings}
                                />
                            )
                        }
                    ]}
                    icon={iconsSettings.sync}
                />
            </Button>
        )
    }
}