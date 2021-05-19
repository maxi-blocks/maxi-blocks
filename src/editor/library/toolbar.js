/**
 * Internal dependencies
 */
import { library } from '../../icons';
import Button from '../../components/button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ToolbarButton = props => {
	const { label, onClick, className, isSelected } = props;

	const classes = classnames('maxi-cloud-toolbar__button', className);

	return (
		<Button className={classes} onClick={onClick} aria-pressed={isSelected}>
			{label}
		</Button>
	);
};

const LibraryToolbar = props => {
	const { type, onChange } = props;

	const buttons = [
		{ label: 'Style Cards', value: 'styleCards' },
		{ label: 'Pages', value: 'pages' },
		{ label: 'Block Patterns', value: 'patterns' },
		{ label: 'Global', value: 'global' },
		{ label: 'Blocks', value: 'blocks' },
	];

	return (
		<div className='maxi-cloud-toolbar'>
			<a className='maxi-cloud-toolbar__logo'>
				{library}
				Maxi Cloud Library
			</a>
			<div>
				{buttons.map(button => (
					<ToolbarButton
						key={`maxi-cloud-toolbar__button__${button.value}`}
						label={button.label}
						onClick={() => onChange(button.value)}
						isSelected={type === button.value}
					/>
				))}
			</div>
			<a className='maxi-cloud-toolbar__help-button'>
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
	);
};

export default LibraryToolbar;
