/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ButtonBlockerAppender } = wp.blockEditor;
const { dispatch } = wp.data;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const BlockPlaceholder = props => {
    const { clientId, className, content = '' } = props;

    const classes = classnames('maxi-block-placeholder', className);

    return (
        <div
            className={classes}
            onClick={() => dispatch('core/editor').selectBlock(clientId)}
        >
            <p className='maxi-block-placeholder__text'>{content}</p>
            <ButtonBlockerAppender
                rootClientId={clientId}
                className='maxi-block-placeholder__button'
            />
        </div>
    );
};

export default BlockPlaceholder;
