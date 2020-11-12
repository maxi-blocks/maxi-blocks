/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { Button } = wp.components;

/**
 * Internal dependencies
 */
import { library } from '../../icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ToolbarButton = props => {
	const { label, onClick, className } = props;

	const classes = classnames('maxi-cloud-toolbar__button', className);

	return (
		<Button className={classes} onClick={onClick}>
			{label}
		</Button>
	);
};

const LibraryToolbar = props => {
	const { type, onChange } = props;

	return (
		<Fragment>
			<div className='spinner-wrapper'>
				<div className='spinner' />
			</div>
			<div className='maxi-cloud-header'>
				<a
					className='maxi-cloud-header__logo'
					href="<?php echo esc_url( home_url( '/' ) ) ?>"
				>
					{library}
					Maxi Cloud Library
				</a>
				<div>
					<ToolbarButton
						label='Style Cards'
						onClick={() => onChange('styleCards')}
						isSelected={type === 'styleCards'}
					/>
					<ToolbarButton
						label='Pages'
						onClick={() => onChange('pages')}
						isSelected={type === 'pages'}
					/>
					<ToolbarButton
						label='Block Patterns'
						onClick={() => onChange('patterns')}
						isSelected={type === 'patterns'}
					/>
					<ToolbarButton
						label='Global'
						onClick={() => onChange('global')}
						isSelected={type === 'global'}
					/>
					<ToolbarButton
						label='Blocks'
						onClick={() => onChange('blocks')}
						isSelected={type === 'blocks'}
					/>
				</div>
				<a className='maxi-cloud-header__help-button'>
					Help
					{/** This SVG needs to be replaced with a component */}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						xmlnsXlink='http://www.w3.org/1999/xlink'
						width='16'
						height='16'
					>
						<image
							data-name='Group 6'
							width='16'
							height='16'
							xlinkHref='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfkBhIRBABN2ZXDAAABUklEQVQoz02SMUtbARSFv9RHJU+UiIuUKsEiCgmoJXQslg4OdhNacAiVrA4OLXTQzaBY6CBdOxREbIeqSP0FIggVjJDSwUGMKKIgghUJNp+D78We6XLu4XLvOTchdWR5SpoLSmxSjcmEcXOWJL+p8Y/HdPORxUgh4qB/fW+beT/7zrQvPPKTiCBmPfWVSXeMkROPnLwT9PvTOXFBnbfXN2pFzLlru+AXt3xoszce3A11XU2LK35wOKCLM6pU+co5AJ0MADfAKiM8CrhiH4ACAEMskWKSQ+CQBzQFNNBUd6KXH4RMUQQghVQDLnlCyBUAGUKKTEfyZ5T5g2/dNB+t12jG5qhutexL2xHH3DMlYp8lX0eCZb/FRuGM+w6IOU8dFUO/u2NSrGcxzgQl1jkhZJDnlChw/X9Y0EGBHq5p4ZglNmI6qJ9YYY1LWqixza/7H7gFrxPHrrhtQooAAAAASUVORK5CYII='
						/>
					</svg>
				</a>
			</div>
		</Fragment>
	);
};

export default LibraryToolbar;
