/**
 * WordPress dependencies
 */
const { Button } = wp.components;
const { useDispatch, select } = wp.data;
const { parse } = wp.blocks;
const { apiFetch } = wp;

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
				const isValid = select('core/block-editor').isValidTemplate(
					parsedContent
				);

				if (isValid) {
					replaceBlocks(clientId, parsedContent);
					onRequestClose();
				}
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
