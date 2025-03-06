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
			borderBottom: '1px solid var(--maxi-grey-light)',
			backgroundColor: `${
				state.isFocused ? 'rgba(229, 242, 248, 0.7)' : 'var(--maxi-white)'
			} !important`,
			color: 'var(--maxi-grey) !important',
			width: 'auto',
			cursor: 'pointer',
		}),
		control: () => ({
			display: 'flex',
			padding: '0',
			height: '32px',
			marginBottom: '8px',
			borderRadius: '5px',
			border: '1px solid var(--maxi-grey-light)',
			cursor: 'pointer',
			background: 'var(--maxi-white)',
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
