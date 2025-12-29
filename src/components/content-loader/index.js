/**
 * External dependencies
 */
import { BarLoader, PuffLoader } from 'react-spinners';

/**
 * Styles and icons
 */
import './editor.scss';

const ContentLoader = props => {
	const { cloud, overlay } = props;
	const containerStyles = overlay ? { position: 'absolute', zIndex: 2 } : {};
	return (
		<div
			style={{
				...containerStyles,
				display: 'flex',
				flexDirection: 'column',
				placeContent: 'center',
				width: '100%',
				height: '100%',
			}}
		>
			{cloud && (
				<>
					<BarLoader
						className='maxi-blocks-content-loader__bar'
						color='#e3e3e3'
						width={515}
						height={25}
						speedMultiplier={0.5}
						cssOverride={{
							margin: '0 auto',
							boxShadow: '0 0 0 3px #e3e3e3',
							borderRadius: '20px',
							backgroundColor: '#fff',
						}}
					/>
					<h3
						className='maxi-text-loader'
						style={{ textAlign: 'center' }}
					/>
				</>
			)}
			{!cloud && (
				<PuffLoader
					color='var(--mpc)'
					size={30}
					speedMultiplier={0.8}
					cssOverride={{
						margin: '0 auto',
					}}
					className='maxi-puff-loader'
				/>
			)}
		</div>
	);
};

export default ContentLoader;
