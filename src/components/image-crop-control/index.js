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
import { capitalize, isEmpty, isObject } from 'lodash';

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
	const { cropOptions, mediaID, className, onChange } = props;

	const classes = classnames('maxi-image-crop-control', className);

	const cropOptionsValue = !isObject(cropOptions)
		? JSON.parse(cropOptions)
		: cropOptions;

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
		x: !isEmpty(cropOptionsValue) ? cropOptionsValue.crop.x : 0,
		y: !isEmpty(cropOptionsValue) ? cropOptionsValue.crop.y : 0,
		width: !isEmpty(cropOptionsValue) ? cropOptionsValue.crop.width : 0,
		height: !isEmpty(cropOptionsValue) ? cropOptionsValue.crop.height : 0,
	});

	const ajaxurl = wp.ajax.settings.url;

	const getScale = () => {
		return cropOptionsValue.crop.scale / 100;
	};

	const scaleX = () => {
		return image.naturalWidth / image.width;
	};

	const scaleY = () => {
		return image.naturalHeight / image.height;
	};

	const getX = () => {
		return cropOptionsValue.crop.x * scaleX();
	};

	const getY = () => {
		return cropOptionsValue.crop.y * scaleY();
	};

	const getWidth = () => {
		return (cropOptionsValue.crop.width * scaleX()).toFixed(0);
	};

	const getHeight = () => {
		return (cropOptionsValue.crop.height * scaleY()).toFixed(0);
	};

	const deleteFile = () => {
		const data = new FormData();
		data.append('old_media_src', cropOptionsValue.image.source_url);

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

				cropOptionsValue.image.source_url = res;
				onChange(cropOptionsValue);
			})
			.catch(err => {
				console.error(
					__(`Error cropping the image: ${err}`, 'maxi-blocks')
				);
			});
	};

	useEffect(() => {
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
			cropOptionsValue.crop.x = crop.width ? crop.x : 0;
			cropOptionsValue.crop.y = crop.height ? crop.y : 0;
			cropOptionsValue.crop.width = crop.width ? crop.width : image.width;
			cropOptionsValue.crop.height = crop.height
				? crop.height
				: image.height;
			cropOptionsValue.image.width = crop.width
				? crop.width
				: image.width;
			cropOptionsValue.image.height = crop.height
				? crop.height
				: image.height;
		}

		onChange(cropOptionsValue);
	};

	const onImageLoad = image => {
		setImage(image);
		cropOptionsValue.crop.width = image.width;
		cropOptionsValue.crop.height = image.height;
		cropOptionsValue.image.width = image.width;
		cropOptionsValue.image.height = image.height;

		onChange(cropOptionsValue);

		return false;
	};

	const onInputChange = (target, value) => {
		cropOptionsValue.crop[target] = value;
		onChange(cropOptionsValue);

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
									cropOptionsValue.crop.width *
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
									cropOptionsValue.crop.height *
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
								value={cropOptionsValue.crop.x}
								onChange={value => onInputChange('x', value)}
							/>
							<GeneralInput
								target='y'
								value={cropOptionsValue.crop.y}
								onChange={value => onInputChange('y', value)}
							/>
							<GeneralInput
								target='scale'
								value={Number(cropOptionsValue.crop.scale)}
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
