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
import PopoverControl from '../popover-control';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import './style.scss';
import { sync } from '../../icons';

/**
 * Component
 */
export default class LinkedButton extends Component {

    state= {
        uniqueHash: (Math.random() * 10000).toFixed(0)
    }

    componentDidMount() {
        this.popoverPosition();
    }

    popoverPosition() {
        const target = document.querySelector(`.maxi-externalbutton-unique-${this.state.uniqueHash} .maxi-externalbutton-popover`);
        const reference = document.querySelector(`button.maxi-externalbutton-unique-${this.state.uniqueHash}`);
        const scrollEl = getScrollContainer(target);
        if (isNil(target) || isNil(reference)) {
            return;
        }
        new FixObjectFollower(target, reference, scrollEl, 'down');
    }

    render() {
        const {
            className,
            placeholder = __('External link', 'maxi-blocks'),
            buttonText,
            onTextChange,
            externalLink,
            onLinkChange,
            settings = [
                {
                    id: 'opensInNewTab',
                    title: __('Open in new tab', 'maxi-blocks')
                }
            ],
        } = this.props;

        const { uniqueHash } = this.state;

        const value = typeof externalLink === 'object' ? externalLink : JSON.parse(externalLink);

        let classes = classnames(
            `maxi-externalbutton-control maxi-externalbutton-unique-${uniqueHash}`, 
            className
        );

        return (
            <Button
                className={classes}
            >
                <RichText
                    tagName="span"
                    className="maxi-externalbutton-richtext"
                    placeholder={placeholder}
                    value={buttonText}
                    onChange={val => onTextChange(val)}
                />
                <PopoverControl
                    className="maxi-externalbutton-popover"
                    popovers={[
                        {
                            content: (
                                <__experimentalLinkControl
                                    className="maxi-image-box-read-more-link"
                                    value={value}
                                    onChange={val => onLinkChange(val)}
                                    settings={settings}
                                />
                            )
                        }
                    ]}
                    icon={sync}
                />
            </Button>
        )
    }
}
