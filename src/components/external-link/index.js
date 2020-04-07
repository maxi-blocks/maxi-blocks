/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { __experimentalLinkControl } = wp.blockEditor;

/**
 * External dependencies
 */
import { PopoverControl } from '../popover/';

/**
 * Block
 */
const ExternalLink = props => {
    const {
        label = '',
        className = 'gx-externallink-control',
        externalLink,
        onChange,
        settings = [],
    } = props;

    const value = JSON.parse(externalLink);

    const getLabel = () => {
        if (typeof value.title != 'undefined' && value.title.length > 3) {
            return value.title;
        }
        else {
            return label;
        }
    }

    return (
        <PopoverControl 
            label={getLabel()}
            className={className}
            popovers={[
                {
                    content:(
                        <__experimentalLinkControl
                            className="gx-image-box-read-more-link"
                            value={value}
                            onChange={onChange}
                            settings={settings}
                        />
                    )
                }
            ]}
        />
    )
}

export default ExternalLink;