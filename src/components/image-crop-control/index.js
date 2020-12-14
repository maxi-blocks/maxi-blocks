/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Spinner } = wp.components;
const { Fragment, useState, useEffect } = wp.element;
const { useSelect } = wp.data;

/**
 * External dependencies
 */
import ReactCrop from 'react-image-crop';
import classnames from 'classnames';
import { capitalize, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const GeneralInput = props => {
	const { target, value, onChange } = props;

	return (
		<label htmlFor={`maxi-image-crop-${target}-control`}>
			{capitalize(target)}
			<input
				type='number'
				id={`maxi-image-crop-${target}-control`}
				name={`maxi-image-crop-${target}-control`}
				value={Number(value).toFixed()}
				onChange={e => onChange(parseInt(e.target.value))}
			/>
		</label>
	);
};

const ImageCropControl = props => {
	const { mediaID, className, onChange } = props;

	const classes = classnames('maxi-image-crop-control', className);

	const cropOptions = { ...props.cropOptions };

	const { imageData } = useSelect(
		select => {
			const { getMedia } = select('core');

			return {
				imageData: getMedia(mediaID),
			};
		},
		[mediaID]
	);

	const [imageID, setImageID] = useState(mediaID);
	const [image, setImage] = useState(null);
	const [crop, setCrop] = useState({
		x: !isEmpty(cropOptions) ? cropOptions.crop.x : 0,
		y: !isEmpty(cropOptions) ? cropOptions.crop.y : 0,
		width: !isEmpty(cropOptions) ? cropOptions.crop.width : 0,
		height: !isEmpty(cropOptions) ? cropOptions.crop.height : 0,
	});

	const ajaxurl = wp.ajax.settings.url;

	const getScale = () => {
		return cropOptions.crop.scale / 100;
	};

	const scaleX = () => {
		return image.naturalWidth / image.width;
	};

	const scaleY = () => {
		return image.naturalHeight / image.height;
	};

	const getX = () => {
		return cropOptions.crop.x * scaleX();
	};

	const getY = () => {
		return cropOptions.crop.y * scaleY();
	};

	const getWidth = () => {
		return +(cropOptions.crop.width * scaleX()).toFixed(0);
	};

	const getHeight = () => {
		return +(cropOptions.crop.height * scaleY()).toFixed(0);
	};

	const deleteFile = () => {
		const data = new FormData();
		data.append('old_media_src', cropOptions.image.source_url);

		fetch(
			`${
				window.location.origin + ajaxurl
			}?action=maxi_remove_custom_image_size`,
			{
				method: 'POST',
				data,
				body: data,
			}
		).catch(err => {
			console.error(
				__(`Error cropping the image: ${err}`, 'maxi-blocks')
			);
		});
	};

	const cropper = () => {
		const data = new FormData();
		data.append('old_media_src', imageData.id);
		data.append('src', imageData.id);
		data.append('src_x', getX());
		data.append('src_y', getY());
		data.append('src_w', getWidth());
		data.append('src_h', getHeight());
		data.append('dst_w', getWidth() * getScale());
		data.append('dst_h', getHeight() * getScale());

		fetch(
			`${
				window.location.origin + ajaxurl
			}?action=maxi_add_custom_image_size`,
			{
				method: 'POST',
				data,
				body: data,
			}
		)
			.then(data => {
				return data.json();
			})
			.then(res => {
				deleteFile();

				cropOptions.image.source_url = res;
				onChange(cropOptions);
			})
			.catch(err => {
				console.error(
					__(`Error cropping the image: ${err}`, 'maxi-blocks')
				);
			});
	};

	useEffect(() => {
		// shouldn't be necessary vvv
		if (imageID !== mediaID) {
			setImageID(mediaID);
			setCrop({
				x: '',
				y: '',
				width: '',
				height: '',
			});
			deleteFile();
			onChange({
				image: {
					source_url: '',
					width: '',
					height: '',
				},
				crop: {
					unit: '',
					x: '',
					y: '',
					width: '',
					height: '',
					scale: 100,
				},
			});
		}
	}, [imageID, mediaID]);

	const saveData = crop => {
		if (crop) {
			cropOptions.crop.x = crop.width ? crop.x : 0;
			cropOptions.crop.y = crop.height ? crop.y : 0;
			cropOptions.crop.width = crop.width ? crop.width : image.width;
			cropOptions.crop.height = crop.height ? crop.height : image.height;
			cropOptions.image.width = getWidth();
			cropOptions.image.height = getHeight();
		}

		onChange(cropOptions);
	};

	const onImageLoad = image => {
		setImage(image);
		cropOptions.crop.width = image.width;
		cropOptions.crop.height = image.height;

		if (!cropOptions.image.source_url)
			cropOptions.image.source_url =
				imageData.media_details.sizes.full.source_url;
		if (!cropOptions.image.width)
			cropOptions.image.width = +imageData.media_details.sizes.full.width;
		if (!cropOptions.image.height)
			cropOptions.image.height = +imageData.media_details.sizes.full
				.height;

		onChange(cropOptions);
	};

	const onInputChange = (target, value) => {
		cropOptions.crop[target] = value;
		onChange(cropOptions);

		cropper();
	};

	const onCropComplete = crop => {
		saveData(crop);

		cropper();
	};

	return (
		<div className={classes}>
			{imageData && (
				<Fragment>
					<ReactCrop
						src={imageData.media_details.sizes.full.source_url}
						crop={crop}
						onImageLoaded={image => onImageLoad(image)}
						onChange={crop => setCrop(crop)}
						onComplete={crop => onCropComplete(crop)}
						keepSelection={false}
					/>
					{image && (
						<div className='maxi-image-crop-control__options'>
							<GeneralInput
								target='width'
								value={
									cropOptions.crop.width *
									scaleX() *
									getScale()
								}
								onChange={value =>
									onInputChange(
										'width',
										value / scaleX() / getScale()
									)
								}
							/>
							<GeneralInput
								target='height'
								value={
									cropOptions.crop.height *
									scaleY() *
									getScale()
								}
								onChange={value =>
									onInputChange(
										'height',
										value / scaleY() / getScale()
									)
								}
							/>
							<GeneralInput
								target='x'
								value={cropOptions.crop.x}
								onChange={value => onInputChange('x', value)}
							/>
							<GeneralInput
								target='y'
								value={cropOptions.crop.y}
								onChange={value => onInputChange('y', value)}
							/>
							<GeneralInput
								target='scale'
								value={Number(cropOptions.crop.scale)}
								onChange={scale =>
									onInputChange('scale', scale)
								}
							/>
						</div>
					)}
				</Fragment>
			)}
			{!imageData && <Spinner />}
		</div>
	);
};

export default ImageCropControl;
