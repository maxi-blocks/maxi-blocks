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
          titleLevel,
          subtitleLevel,
          hideTitle,
          hideSubtitle,
          titleTextAlign,
          subtitleAlign,
          defaultBlockStyle
        },
    } = props;

    const titleStyles = {
      display: hideTitle ? 'none' : undefined,
      textAlign: titleTextAlign,
    };

    const subtitleStyles = {
      display: hideSubtitle ? 'none' : undefined,
      textAlign: subtitleAlign,
    };

    return (
      <div
        className={'gx-block gx-icon-extra'}
        data-gx_initial_block_class={defaultBlockStyle}
      >
      <div class='gx-icon-extra-icon'>
      </div>
        <div class='gx-icon-extra-title'>
            <RichText.Content
                tagName={titleLevel}
                style={titleStyles}
                placeholder={__('Write title…', 'gutenberg-extra')}
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                className="gx-icon-extra-title"
            />
        </div>
        <div class='gx-icon-extra-subtitle'>
            <RichText.Content
                tagName={subtitleLevel}
                style={subtitleStyles}
                placeholder={__('Write title…', 'gutenberg-extra')}
                value={subtitle}
                onChange={(value) => setAttributes({ subtitle: value })}
                className="gx-icon-extra-subtitle"
            />
        </div>
      </div>
    );
}

export default save;
