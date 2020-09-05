/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Spinner } = wp.components;
const { Component, Fragment } = wp.element;
const { withSelect, select } = wp.data;

/**
 * External dependencies
 */
import ReactCrop from 'react-image-crop';
import classnames from 'classnames';
import { debounce, capitalize, isNil, isEmpty } from 'lodash';

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
		<label htmlFor={`maxi-imagecrop-${target}-control`}>
			{capitalize(target)}
			<input
				type='number'
				id={`maxi-imagecrop-${target}-control`}
				name={`maxi-imagecrop-${target}-control`}
				value={Number(value).toFixed()}
				onChange={e => onChange(parseInt(e.target.value))}
			/>
		</label>
	);
};

class ImageCropComponent extends Component {
	state = {
		imageID: this.props.mediaID,
		crop: {
			x: !isEmpty(this.props.cropOptions)
				? this.props.cropOptions.crop.x
				: 0,
			y: !isEmpty(this.props.cropOptions)
				? this.props.cropOptions.crop.y
				: 0,
			width: !isEmpty(this.props.cropOptions)
				? this.props.cropOptions.crop.width
				: 0,
			height: !isEmpty(this.props.cropOptions)
				? this.props.cropOptions.crop.height
				: 0,
		},
		scale: !isEmpty(this.props.cropOptions)
			? this.props.cropOptions.crop.scale
			: 100,
	};

	cropOptions =
		typeof this.props.cropOptions !== 'object'
			? JSON.parse(this.props.cropOptions)
			: this.props.cropOptions;

	componentDidMount() {
		this.forceUpdate(); // solves issue when diselecting and selecting block again
		this.blockId = select('core/block-editor').getSelectedBlockClientId();
	}

	componentDidUpdate() {
		this.checkNewImage();
	}

	componentWillUnmount() {
		if (
			isNil(
				select('core/block-editor').getBlocksByClientId(this.blockId)[0]
			)
		)
			this.deleteFile(this.props.cropOptions);
	}

	checkNewImage() {
		if (this.state.imageID !== this.props.mediaID) {
			this.setState({
				imageID: this.props.mediaID,
				crop: {
					x: 0,
					y: 0,
					width: 0,
					height: 0,
				},
				scale: 100,
			});
			this.deleteFile();
			this.props.onChange({});
		}
	}

	get getScale() {
		return this.cropOptions.crop.scale / 100;
	}

	get scaleX() {
		return this.image.naturalWidth / this.image.width;
	}

	get scaleY() {
		return this.image.naturalHeight / this.image.height;
	}

	get getX() {
		return this.cropOptions.crop.x * this.scaleX;
	}

	get getY() {
		return this.cropOptions.crop.y * this.scaleY;
	}

	get getWidth() {
		return (this.cropOptions.crop.width * this.scaleX).toFixed(0);
	}

	get getHeight() {
		return (this.cropOptions.crop.height * this.scaleY).toFixed(0);
	}

	get getMimeType() {
		return this.originalImageData.mime_type;
	}

	get getFileDate() {
		const date = new Date(Date.now());
		const response =
			date.getDate().toString() +
			date.getMonth().toString() +
			date.getFullYear().toString() +
			date.getHours().toString() +
			date.getMinutes().toString() +
			date.getSeconds().toString();
		return response;
	}

	get getFileType() {
		let extension = this.originalImageData.file;
		extension = extension.substr(extension.lastIndexOf('.') + 1);
		return extension;
	}

	get getFileName() {
		let name = this.originalImageData.file;
		name = name.substr(0, name.lastIndexOf('.'));
		name = `${name}-crop-${(this.getWidth * this.getScale).toFixed(0)}-${(
			this.getHeight * this.getScale
		).toFixed(0)}-${this.getFileDate}.${this.getFileType}`;
		return name;
	}

	get getFilePath() {
		const path = this.originalImageData.source_url.substr(
			0,
			this.originalImageData.source_url.lastIndexOf('/')
		);
		return path;
	}

	get getOldFile() {
		if (isEmpty(this.props.cropOptions)) return '';
		return this.props.cropOptions.image.source_url;
	}

	saveData(crop) {
		if (crop) {
			this.cropOptions.crop.x = crop.width ? crop.x : 0;
			this.cropOptions.crop.y = crop.height ? crop.y : 0;
			this.cropOptions.crop.width = crop.width
				? crop.width
				: this.image.width;
			this.cropOptions.crop.height = crop.height
				? crop.height
				: this.image.height;
			this.cropOptions.image.width = crop.width
				? crop.width
				: this.image.width;
			this.cropOptions.image.height = crop.height
				? crop.height
				: this.image.height;
		}

		this.props.onChange(this.cropOptions);
	}

	onImageLoad(image) {
		this.image = image;
		this.mediaID = this.props.mediaID;
		this.cropOptions.crop.width = image.width;
		this.cropOptions.crop.height = image.height;
		this.cropOptions.image.width = image.width;
		this.cropOptions.image.height = image.height;

		this.props.onChange(this.cropOptions);

		return false;
	}

	debounceComplete = debounce(this.onCropComplete.bind(this), 1000);

	onInputChange(target, value) {
		this.cropOptions.crop[target] = value;
		this.props.onChange(this.cropOptions);
		this.debounceComplete();
	}

	onCropComplete(crop) {
		this.saveData(crop);
		this.setData();
		this.createHiddenCanvas();
		this.cropper();
		this.uploadNewFile();
	}

	setData() {
		this.imageData = this.props.imageData;
		this.originalImageData = this.imageData
			? this.imageData.media_details.sizes.full
			: '';
	}

	createHiddenCanvas() {
		this.hiddenCanvas = document.createElement('canvas');
		this.hiddenCtx = this.hiddenCanvas.getContext('2d');
		this.hiddenCanvas.width = this.getWidth * this.getScale;
		this.hiddenCanvas.height = this.getHeight * this.getScale;
	}

	cropper() {
		this.hiddenCtx.drawImage(
			this.image,
			this.getX,
			this.getY,
			this.getWidth,
			this.getHeight,
			0,
			0,
			this.getWidth * this.getScale,
			this.getHeight * this.getScale
		);
	}

	uploadNewFile() {
		this.hiddenCanvas.toBlob(blob => {
			const newImage = new File([blob], this.getFileName, {
				type: this.getMimeType,
				lastModified: Date.now(),
			});

			const data = new FormData();
			data.append('file', newImage);
			data.append('old_media_src', this.getOldFile);

			fetch(
				`${
					window.location.origin + ajaxurl
				}?action=gx_add_custom_image_size`,
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
					this.cropOptions.image.source_url = res.url;
					this.props.onChange(this.cropOptions);
				})
				.catch(err => {
					console.log(
						__(`Error croping the image: ${err}`, 'maxi-blocks')
					);
				});
		});
	}

	deleteFile() {
		const data = new FormData();
		data.append('old_media_src', this.getOldFile);

		fetch(
			`${
				window.location.origin + ajaxurl
			}?action=gx_remove_custom_image_size`,
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
	}

	render() {
		const { imageData, className } = this.props;

		const classes = classnames('maxi-imagecrop-control', className);

		this.cropOptions =
			typeof this.props.cropOptions !== 'object'
				? JSON.parse(this.props.cropOptions)
				: this.props.cropOptions;

		return (
			<div className={classes}>
				{imageData && (
					<Fragment>
						<ReactCrop
							src={imageData.media_details.sizes.full.source_url}
							crop={this.state.crop}
							onImageLoaded={image => this.onImageLoad(image)}
							onChange={crop => this.setState({ crop })}
							onComplete={crop => this.onCropComplete(crop)}
							keepSelection={false}
						/>
						{this.image && (
							<div className='maxi-imagecrop-control__options'>
								<GeneralInput
									target='width'
									value={
										this.cropOptions.crop.width *
										this.scaleX *
										this.getScale
									}
									onChange={value =>
										this.onInputChange(
											'width',
											value / this.scaleX / this.getScale
										)
									}
								/>
								<GeneralInput
									target='height'
									value={
										this.cropOptions.crop.height *
										this.scaleY *
										this.getScale
									}
									onChange={value =>
										this.onInputChange(
											'height',
											value / this.scaleY / this.getScale
										)
									}
								/>
								<GeneralInput
									target='x'
									value={this.cropOptions.crop.x}
									onChange={value =>
										this.onInputChange('x', value)
									}
								/>
								<GeneralInput
									target='y'
									value={this.cropOptions.crop.y}
									onChange={value =>
										this.onInputChange('y', value)
									}
								/>
								<GeneralInput
									target='scale'
									value={Number(this.cropOptions.crop.scale)}
									onChange={scale =>
										this.onInputChange('scale', scale)
									}
								/>
							</div>
						)}
					</Fragment>
				)}
				{!imageData && <Spinner />}
			</div>
		);
	}
}

export default withSelect((select, ownProps) => {
	const { mediaID = ownProps.mediaID } = ownProps;
	const imageData = select('core').getMedia(mediaID);
	return {
		imageData,
	};
})(ImageCropComponent);
