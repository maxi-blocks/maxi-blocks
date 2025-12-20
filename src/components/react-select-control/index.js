/**
 * External dependencies
 */
import Select from 'react-select';

const ReactSelectControl = ({ labelText, ...props }) => {
	const defaultStyles = {
		option: (base, state) => ({
			...base,
			padding: '8px',
			whiteSpace: 'wrap',
			borderBottom: '1px solid var(--mgl)',
			backgroundColor: `${
				state.isFocused
					? 'rgba(229, 242, 248, 0.7)'
					: 'var(--mw)'
			} !important`,
			color: `${
				state.isFocused ? 'var(--mb)' : 'var(--mg)'
			} !important`,
			width: 'auto',
			cursor: 'pointer',
		}),
		control: () => ({
			display: 'flex',
			padding: '0',
			height: '32px',
			marginBottom: '8px',
			borderRadius: '5px',
			border: '1px solid var(--mgl)',
			cursor: 'pointer',
			background: 'var(--mw)',
		}),
		menu: base => ({
			...base,
			'z-index': '3',
		}),
	};

	const className = 'maxi-react-select-control';

	return (
		<div className={className}>
			{labelText && <label>{labelText}</label>}
			<Select styles={defaultStyles} {...props} />
		</div>
	);
};

export default ReactSelectControl;
