/**
 * WordPress dependencies
 */
import { ButtonBlockAppender } from '@wordpress/block-editor';
import { useRef, useEffect, useState } from '@wordpress/element';

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
		<div ref={ref} className={classes}>
			<p className='maxi-block-placeholder__text'>{content}</p>
			<ButtonBlockAppender
				rootClientId={clientId}
				className='maxi-block-placeholder__button'
			/>
		</div>
	);
};

export default BlockPlaceholder;
