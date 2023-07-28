/**
 * External dependencies
 */
import Select from 'react-select';

const ReactSelectControl = props => {
	const defaultStyles = {
		option: (base, state, selected) => ({
			...base,
			padding: '8px',
			whiteSpace: 'wrap',
			borderBottom: '1px solid #E3E3E3',
			backgroundColor: state.isSelected
				? 'rgb(var(--maxi-light-color-4)) !important'
				: '#fff !important' && state.isFocused
				? 'rgba(229, 242, 248, 0.7) !important'
				: '#fff !important',
			color: state.isSelected
				? '#fff !important'
				: 'color: var(--maxi-grey-5-color) !important',
			width: 'auto',
			cursor: 'pointer',
		}),
		control: () => ({
			display: 'flex',
			padding: '0',
			marginBottom: '8px',
			borderRadius: '0px',
			border: '1px solid rgb(var(--maxi-light-color-4))',
			cursor: 'pointer',
			background: '#fff',
		}),
		menu: base => ({
			...base,
			'z-index': '3',
		}),
	};

	return <Select styles={defaultStyles} {...props} />;
};

export default ReactSelectControl;
