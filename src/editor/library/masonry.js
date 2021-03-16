/**
 * WordPress dependencies
 */
const { Button } = wp.components;
const { useDispatch, select } = wp.data;
const { parse } = wp.blockSerializationDefaultParser;
const { createBlock } = wp.blocks;

const { apiFetch } = wp;

/**
 * External dependencies
 */
import Masonry from 'react-masonry-css';
import { isEmpty } from 'lodash';

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
					<Button
						isLink
						href={demoUrl}
						target='_blank'
						className='maxi-cloud-masonry-card__button'
					>
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

	const { replaceBlocks } = useDispatch('core/editor');

	/**
	 * Well, this is a cheating function. It generates new blocks with the content get from the parse process,
	 * and is avoiding the validation that throws and error on the console. This wouldn't be a problem in future,
	 * onces we have a stable version with deprecations. The problem is that we are still changing the 'save' part
	 * of some blocks, so when parsing with wp.blocks.parse is validating and throwing an error. Now we are creating
	 * new blocks replacing the non-validate ones.
	 */
	const cleanOriginalContent = content => {
		return content.map(block => {
			if (!isEmpty(block.innerBlocks))
				block.innerBlocks = cleanOriginalContent(block.innerBlocks);

			return createBlock(block.blockName, block.attrs, block.innerBlocks);
		});
	};

	const onRequestInsert = async id => {
		const serverURL = await apiFetch({
			path: 'wp/v2/settings',
		}).then(res => {
			const serverURL = res['maxi-blocks-cloud-library-api-server'];
			if (new URL(serverURL)) return serverURL;

			console.error(
				`Ups, seems the server URL you've set is not valid => ${serverURL}. Change it and try again 👍`
			);

			return false;
		});

		if (!serverURL) return false;

		const clientId = select('core/block-editor').getSelectedBlockClientId();

		await fetch(
			`${serverURL}/wp-json/maxi-blocks-API/v0.1/${type}/content/${id}`
		)
			.then(response => response.json())
			.then(data => {
				const parsedContent = parse(data[0].content);

				const cleanParsedContent = cleanOriginalContent(parsedContent);

				replaceBlocks(clientId, cleanParsedContent);
				onRequestClose();
			})
			.catch(err => console.error(err));

		return true;
	};

	return (
		<Masonry
			className='maxi-cloud-masonry'
			breakpointCols={breakpointColumnsObj}
			columnClassName='maxi-cloud-masonry__column'
		>
			{Object.values(elements).map(element => {
				return (
					<MasonryItem
						key={`maxi-cloud-masonry__item-${element.id}`}
						demoUrl={element.post_url}
						previewIMG={element.preview_image_url}
						isPro={element.cost === 'pro'}
						serial={element.serial}
						onRequestInsert={() => onRequestInsert(element.id)}
					/>
				);
			})}
		</Masonry>
	);
};

export default LibraryMasonry;
