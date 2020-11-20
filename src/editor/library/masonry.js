/**
 * WordPress dependencies
 */
const { Button } = wp.components;
const { useDispatch, select } = wp.data;

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import Masonry from 'react-masonry-css';

/**
 * Component
 */
const MasonryItem = props => {
	const { demoUrl, previewIMG, isPro, serial, onRequestInsert } = props;

	return (
		<div className='maxi-cloud-masonry-card'>
			<div className='maxi-cloud-masonry-card__image'>
				<img src={previewIMG} alt={`Preview for ${serial}`} />
			</div>
			<div className='maxi-cloud-masonry-card__container'>
				<div className='maxi-cloud-masonry-card__buttons'>
					<Button className='maxi-cloud-masonry-card__button'>
						Preview
					</Button>
					<Button className='maxi-cloud-masonry-card__button'>
						Update
					</Button>
					<Button
						className='maxi-cloud-masonry-card__button'
						onClick={onRequestInsert}
					>
						Insert
					</Button>
				</div>
				<div className='maxi-cloud-masonry-card__tags'>
					{isPro && (
						<span className='maxi-cloud-masonry__pro-tag'>PRO</span>
					)}
					<p className='maxi-cloud-masonry__serial-tag'>{serial}</p>
				</div>
			</div>
		</div>
	);
};

const LibraryMasonry = props => {
	const { elements, onRequestClose } = props;

	const breakpointColumnsObj = {
		default: 4,
		1800: 3,
		1280: 2,
		700: 1,
	};

	const { replaceBlocks } = useDispatch('core/editor');

	const onRequestInsert = content => {
		const clientId = select('core/block-editor').getSelectedBlockClientId();
		const parsedContent = JSON.parse(content);
		const isValid = select('core/block-editor').isValidTemplate(
			parsedContent
		);

		if (isValid) {
			replaceBlocks(clientId, parsedContent);
			onRequestClose();
		}
	};

	return (
		<Masonry
			className='maxi-cloud-masonry'
			breakpointCols={breakpointColumnsObj}
			columnClassName='maxi-cloud-masonry__column'
		>
			{Object.values(elements).map(element => (
				<MasonryItem
					key={`maxi-cloud-masonry__item-${element.id}`}
					demoUrl={element.demo_url}
					// previewIMG={element.preview_imga_url}
					previewIMG='http://localhost/maxiblocks/wp-content/uploads/2020/08/ezgif-6-1c0478cf3eff.jpg'
					isPro={element.cost === 'pro'}
					serial={element.title}
					onRequestInsert={() => onRequestInsert(element.content)}
				/>
			))}
		</Masonry>
	);
};

export default LibraryMasonry;
