/**
 * WordPress dependencies
 */
import { ButtonBlockAppender } from '@wordpress/block-editor';
import { useRef, useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

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
	const { className, content = '' } = props;

	const { selectBlock } = useDispatch('core/block-editor');

	const classes = classnames('maxi-block-placeholder', className);

	const [clientId, setClientId] = useState(null);

	const ref = useRef(null);

	useEffect(() => {
		if (ref.current) {
			const blockClientId = ref.current
				.closest('.maxi-block')
				.getAttribute('data-block');

			if (blockClientId) setClientId(blockClientId);
		}
	}, [ref.current]);

	return (
		<div
			ref={ref}
			className={classes}
			onClick={({ target }) => {
				if (target.classList.contains('block-editor-inserter'))
					clientId && selectBlock(clientId);
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
