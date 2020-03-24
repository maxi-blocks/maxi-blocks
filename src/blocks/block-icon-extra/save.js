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
            defaultBlockStyle
        },
    } = props;

    const titleStyles = {};

    return (
      <div
        className={'gx-block gx-icon-extra'}
        data-gx_initial_block_class={defaultBlockStyle}
      >
      <div class='gx-icon-extra-icon'>
      </div>
        <div class='gx-icon-extra-text'>
            <RichText.Content
                tagName='p'
                style={titleStyles}
                placeholder={__('Write title…', 'gutenberg-extra')}
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                className="gx-icon-extra-title"
            />
        </div>
      </div>
    );
}

export default save;
