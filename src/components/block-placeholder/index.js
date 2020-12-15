/**
 * WordPress dependencies
 */
const { ButtonBlockerAppender } = wp.blockEditor;
const { useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import getClosest from './getClosest';

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
	const { clientId, className, content = '' } = props;

	const classes = classnames('maxi-block-placeholder', className);

	const { selectBlock } = useDispatch('core/editor');

	return (
		<div
			className={classes}
			onClick={e => {
				e.preventDefault();
				isNull(
					getClosest(e.target, '.maxi-block-placeholder__button')
				) && selectBlock(clientId);
			}}
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
