/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Icons
 */
import { moveRight } from '../../icons';

/**
 * Styles
 */
import './editor.scss';

const ListItemControl = props => {
	const {
		className,
		content,
		isCloseButton = true,
		isOpen,
		onOpen,
		onRemove,
		title,
	} = props;

	const classes = classnames(
		className,
		'maxi-list-item-control',
		isOpen && 'maxi-list-item-control__open'
	);

	return (
		<div className={classes}>
			<div
				className='maxi-list-item-control__row'
				onClick={({ target }) => {
					if (
						!target
							?.closest('span')
							?.classList?.contains(
								'maxi-list-item-control__ignore-open'
							)
					)
						onOpen(!!isOpen);
				}}
			>
				<span className='maxi-list-item-control__arrow'>
					{moveRight}
				</span>
				<div className='maxi-list-item-control__title'>
					<span className='maxi-list-item-control__title__id' />
					{title}
					{isCloseButton && (
						<span
							className={classnames(
								'maxi-list-item-control__title__remover',
								'maxi-list-item-control__ignore-move',
								'maxi-list-item-control__ignore-open'
							)}
							onClick={onRemove}
						/>
					)}
				</div>
			</div>
			{isOpen && (
				<div className='maxi-list-item-control__content maxi-list-item-control__ignore-move'>
					{content}
				</div>
			)}
		</div>
	);
};

export default ListItemControl;
