/**
 * Some different options for the component
 */

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { getScrollContainer } = wp.dom;
const { Button } = wp.components;
const { select } = wp.data;
const { 
    RichText,
    __experimentalLinkControl 
} = wp.blockEditor;

/**
 * External dependencies
 */
import { PopoverControl } from '../../popover/';
import { isNil } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Block
 */
export const LinkedButton = props => {
    const {
        className = 'gx-externalbutton-control',
        placeholder = __('External link', 'gutenberg-extra'),
        buttonText,
        onTextChange,
        externalLink,
        onLinkChange,
        settings = [],
    } = props;

    const value = typeof externalLink === 'object' ? externalLink : JSON.parse(externalLink);
    const attributes = select('core/block-editor').getBlockAttributes(select('core/block-editor').getSelectedBlockClientId());

    const popoverPosition = (uniqueID) => {
        const target = document.querySelector(`.${uniqueID} .${className} .gx-externalbutton-popover`);
        const reference = document.querySelector(`button.${className}`);
        const scrollEl = getScrollContainer(target);
        if(isNil(target) || isNil(reference)) {
            return;
        }
        new FixObjectFollower (target, reference, scrollEl);
    }

    if (!isNil(attributes)) {
        popoverPosition(attributes.uniqueID)
    }

    return (
        <Button
            className={className}
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
            />
        </Button>
    )
}


// const LinkedText = props => {
//     const {
//         content = undefined,
//         label = __('External link', 'gutenberg-extra'),
//         className = 'gx-externallink-control',
//         externalLink,
//         onChange,
//         settings = [],
//     } = props;

//     const value = typeof externalLink === 'object' ? externalLink : JSON.parse(externalLink);

//     const getLabel = () => {
//         if (typeof content != 'undefined' ) {
//             return content;
//         }
//         if (typeof value.title != 'undefined' && value.title.length > 3) {
//             return value.title;
//         }
//         else {
//             return label;
//         }
//     }

//     return (
//         <PopoverControl 
//             label={getLabel()}
//             className={className}
//             popovers={[
//                 {
//                     content:(
//                         <__experimentalLinkControl
//                             className="gx-image-box-read-more-link"
//                             value={value}
//                             onChange={onChange}
//                             settings={settings}
//                         />
//                     )
//                 }
//             ]}
//         />
//     )
// }

// export default LinkedText;