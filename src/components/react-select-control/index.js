/**
 * WordPress dependencies
 */
import { Suspense, lazy } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Spinner from '@components/spinner';

/**
 * External dependencies
 */
const Select = lazy(() => import('react-select').then(m => ({ default: m.default })));

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
			<Suspense fallback={<Spinner />}>
				<Select styles={defaultStyles} {...props} />
			</Suspense>
		</div>
	);
};

export default ReactSelectControl;

