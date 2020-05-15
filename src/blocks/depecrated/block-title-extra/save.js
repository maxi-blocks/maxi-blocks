/**
 * WordPress dependencies
 */
const { RichText } = wp.blockEditor;

/**
 * Internal dependencies
 */
import { Divider } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = (props) => {
    const {
        className,
        attributes: {
            subtitle,
            title,
            text,
            titleLevel,
            subtitleLevel,
            blockStyle,
            defaultBlockStyle,
            uniqueID,
            extraClassName,
            divider
        },
    } = props;

    let classes = classnames('maxi-block maxi-title-extra', blockStyle, extraClassName, className);
    if (uniqueID && (typeof uniqueID !== 'undefined')) {
        classes = classnames(classes, uniqueID)
    }

    return (
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <div style={{ order: 0 }}>
                <RichText.Content
                    tagName={subtitleLevel}
                    value={subtitle}
                    className="maxi-title-extra-subtitle"
                />
            </div>
            <div style={{ order: 1 }}>
                <RichText.Content
                    tagName={titleLevel}
                    value={title}
                    className="maxi-title-extra-title"
                />
            </div>
            <Divider
                dividerSettings={divider}
            />
            <div style={{ order: 3 }}>
                <RichText.Content
                    tagName="h6"
                    value={text}
                    className="maxi-title-extra-text"
                />
            </div>
        </div>
    )
}

export default save;
