/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { BarLoader, PuffLoader } from 'react-spinners';
import SVG from 'react-inlinesvg';

/**
 * Styles and icons
 */
import './editor.scss';
import Svg1 from './img/1.svg';
import Svg2 from './img/2.svg';
import Svg3 from './img/3.svg';
import Svg4 from './img/4.svg';
import Svg5 from './img/5.svg';

const svgImages = [Svg1, Svg2, Svg3, Svg4, Svg5];

const ContentLoader = props => {
	const { cloud, name } = props;
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				placeContent: 'center',
				width: '100%',
				height: '100%',
			}}
		>
			{cloud && (
				<SVG
					src={
						svgImages[Math.floor(Math.random() * svgImages.length)]
					}
					style={{
						margin: '0 auto',
						width: '250px',
						height: '240px',
					}}
				/>
			)}
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
					color='#ff4a17'
					size={30}
					speedMultiplier={0.8}
					cssOverride={{
						margin: '0 auto',
					}}
				/>
			)}
		</div>
	);
};

export default ContentLoader;
