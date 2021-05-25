/**
 * WordPress dependencies
 */
import { useDispatch, select } from '@wordpress/data';
import { parse } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Button from '../../components/button';

/**
 * External dependencies
 */
import Masonry from 'react-masonry-css';

/**
 * Component
 */
const MasonryItem = props => {
	const { previewIMG, isPro, serial, onRequestInsert } = props;

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
	const { elements, type, onRequestClose } = props;

	const breakpointColumnsObj = {
		default: 4,
		1800: 3,
		1280: 2,
		700: 1,
	};

	const { replaceBlocks } = useDispatch('core/block-editor');

	const onRequestInsert = async id => {
		const clientId = select('core/block-editor').getSelectedBlockClientId();

		await fetch(
			`http://localhost:8080/maxiblocks/wp-json/maxi-blocks-API/v0.1/${type}/content/${id}`
		)
			.then(response => response.json())
			.then(data => {
				const parsedContent = parse(data);
				const isValid = select('core/block-editor').isValidTemplate(
					parsedContent
				);

				if (isValid) {
					replaceBlocks(clientId, parsedContent);
					onRequestClose();
				}
			})
			.catch(err => console.error(err));
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
					previewIMG={element.preview_image_url}
					isPro={element.cost === 'pro'}
					serial={element.title}
					onRequestInsert={() => onRequestInsert(element.id)}
				/>
			))}
		</Masonry>
	);
};

export default LibraryMasonry;
