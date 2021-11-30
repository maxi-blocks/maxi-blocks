/**
 * WordPress dependencies
 */
import { ButtonBlockAppender } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNull } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const BlockPlaceholder = props => {
	const { className, content = '' } = props;

	const classes = classnames('maxi-block-placeholder', className);

	const { clientId } = useSelect(select => {
		const { getSelectedBlockClientId } = select('core/block-editor');

		const clientId = getSelectedBlockClientId();

		return { clientId };
	});

	const { selectBlock } = useDispatch('core/block-editor');

	return (
		<div
			className={classes}
			onClick={e => {
				e.preventDefault();

				!isNull(
					e.target.querySelector('.maxi-block-placeholder__button')
				) && selectBlock(clientId);
			}}
		>
			<p className='maxi-block-placeholder__text'>{content}</p>
			<ButtonBlockAppender
				rootClientId={clientId}
				className='maxi-block-placeholder__button'
			/>
		</div>
	);
};

export default BlockPlaceholder;
