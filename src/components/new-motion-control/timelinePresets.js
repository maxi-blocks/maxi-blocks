/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Button, SelectControl } = wp.components;
const { Fragment } = wp.element;
const { useState } = wp.element;
const { useSelect, useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import { isEmpty, forIn } from 'lodash';

/**
 * Component
 */
const TimelinePresets = props => {
	const { onChange } = props;

	const [presetName, setPresetName] = useState('');
	const [presetLoad, setPresetLoad] = useState('');
	const { saveMaxiMotionPresets } = useDispatch('maxiBlocks');

	const { presets } = useSelect(select => {
		const { receiveMaxiMotionPresets } = select('maxiBlocks');

		return {
			presets: receiveMaxiMotionPresets(),
		};
	});

	const getPresets = () => {
		switch (typeof presets) {
			case 'string':
				if (!isEmpty(presets)) return JSON.parse(presets);
				return {};
			case 'object':
				return presets;
			case 'undefined':
				return {};
			default:
				return {};
		}
	};

	const getPresetsOptions = () => {
		const presetArr = [
			{ label: __('Select your preset', 'maxi-blocks'), value: '' },
		];

		forIn(getPresets(), (value, key) =>
			presetArr.push({ label: value.name, value: key })
		);
		return presetArr;
	};

	return (
		<div className='maxi-motion-control__preset'>
			<FancyRadioControl
				label={__('Preset', 'maxi-blocks')}
				selected={+props['motion-preset-status']}
				options={[
					{
						label: __('Yes', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('No', 'maxi-blocks'),
						value: 0,
					},
				]}
				onChange={val =>
					onChange({ 'motion-preset-status': !!Number(val) })
				}
			/>
			{props['motion-preset-status'] && (
				<Fragment>
					{getPresetsOptions().length > 1 && (
						<div className='maxi-motion-control__preset__load'>
							<SelectControl
								value={presetLoad}
								options={getPresetsOptions()}
								onChange={val => setPresetLoad(val)}
							/>
							<Button
								disabled={isEmpty(presetLoad)}
								onClick={() => {
									onChange({
										'motion-time-line': {
											...getPresets()[presetLoad].preset,
										},
										'motion-active-time-line-time': +Object.keys(
											getPresets()[presetLoad].preset
										)[0],
										'motion-active-time-line-index': 0,
									});
									setPresetLoad('');
								}}
							>
								{__('Load', 'maxi-blocks')}
							</Button>
							<Button
								className='maxi-motion-control__preset__load--delete'
								disabled={isEmpty(presetLoad)}
								onClick={() => {
									const newPresets = {
										...getPresets(),
									};

									if (
										window.confirm(
											sprintf(
												__(
													'Are you sure to delete "%s" preset?',
													'maxi-blocks'
												),
												getPresets()[presetLoad].name
											)
										)
									) {
										delete newPresets[presetLoad];
										saveMaxiMotionPresets(newPresets);
										setPresetLoad('');
									}
								}}
							>
								{__('Delete', 'maxi-blocks')}
							</Button>
						</div>
					)}
					<div className='maxi-motion-control__preset__save'>
						<input
							type='text'
							placeholder={__(
								'Add your Preset Name here',
								'maxi-blocks'
							)}
							value={presetName}
							onChange={e => setPresetName(e.target.value)}
						/>
						<Button
							disabled={isEmpty(presetName)}
							onClick={() => {
								if (isEmpty(presets)) {
									saveMaxiMotionPresets({
										[`pre_${new Date().getTime()}`]: {
											name: presetName,
											preset: {
												...props['motion-time-line'],
											},
										},
									});
								} else {
									saveMaxiMotionPresets({
										...getPresets(),
										[`pre_${new Date().getTime()}`]: {
											name: presetName,
											preset: {
												...props['motion-time-line'],
											},
										},
									});
								}

								setPresetName('');
							}}
						>
							{__('Save Preset', 'maxi-blocks')}
						</Button>
					</div>
				</Fragment>
			)}
			<hr />
		</div>
	);
};
export default TimelinePresets;
