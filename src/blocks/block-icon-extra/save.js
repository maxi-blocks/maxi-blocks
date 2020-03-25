import Icon from '../../components/icon/index';
import classnames from 'classnames';
import { BlockStyles } from '../../components/block-styles/index';
/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const {
    RichText,
} = wp.blockEditor;

/**
 * External dependencies
 */

const save = (props) => {
    const {
        className,
        attributes: {
          title,
          subtitle,
          description,
          titleLevel,
          subtitleLevel,
          hideTitle,
          hideSubtitle,
          titleTextAlign,
          subtitleAlign,
          iconBackgroundColor,
          iconSizeUnit,
          iconSize,
          iconRotationUnit,
          iconRotate,
          hideDescription,
          descriptionTextAlign,
          defaultBlockStyle,
          extraClassName,
          uniqueID
        },
    } = props;

    const titleStyles = {
      display: hideTitle ? 'none' : undefined,
      fontWeight: '400',
      textAlign: titleTextAlign,
    };

    const subtitleStyles = {
      display: hideSubtitle ? 'none' : undefined,
      fontWeight: '400',
      textAlign: subtitleAlign,
    };

    const descriptionStyles = {
      display: hideDescription ? 'none' : undefined,
      fontWeight: '400',
      textAlign: descriptionTextAlign,
    };

    const blockStyle = {};

    let classes = classnames( className );
    if ( uniqueID && (typeof uniqueID !== 'undefined') ) {
        classes = classnames( classes, uniqueID )
    }

    return (
      <div
        className={blockStyle + ' gx-block gx-icon-extra ' + classes + ' ' + extraClassName}
        data-gx_initial_block_class={defaultBlockStyle}
      >
      <div class='gx-icon-extra-icon'>
      </div>
        <div class='gx-icon-extra-title-wrapper'>
            <RichText.Content
                tagName={titleLevel}
                style={titleStyles}
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                className="gx-icon-extra-title"
            />
        </div>
        <div class='gx-icon-extra-subtitle-wrapper'>
            <RichText.Content
                tagName={subtitleLevel}
                style={subtitleStyles}
                value={subtitle}
                onChange={(value) => setAttributes({ subtitle: value })}
                className="gx-icon-extra-subtitle"
            />
        </div>
        <div class='gx-icon-extra-description-wrapper'>
            <RichText.Content
                tagName='h6'
                style={descriptionStyles}
                value={description}
                onChange={(value) => setAttributes({ description: value })}
                className="gx-icon-extra-description"
            />
        </div>
      </div>
    );
}

export default save;
