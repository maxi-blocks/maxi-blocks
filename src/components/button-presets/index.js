/**
 * Internal Dependencies
 */
import {
	PresetOne,
	PresetTwo,
	PresetThree,
	PresetFour,
	PresetFive,
	PresetSix,
} from '../../icons';
import newButtonAttributes from './utils';

/**
 * Styles
 */
import './editor.scss';

const PresetsIcons = props => {
	const { buttonAttributes, onChange, resetBlockAttributes } = props;

	const onChangePreset = presetNumber => {
		resetBlockAttributes();
		onChange(newButtonAttributes(buttonAttributes, presetNumber));
	};

	return (
		<div className='maxi-button-presets'>
			<div className='maxi-button-presets__icons-group'>
				<span
					className='maxi-button-presets__icon'
					onClick={() => onChangePreset(1)}
				>
					<PresetOne />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() => onChangePreset(2)}
				>
					<PresetTwo />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() => onChangePreset(3)}
				>
					<PresetThree />
				</span>
			</div>

			<div className='maxi-button-presets__icons-group'>
				<span
					className='maxi-button-presets__icon'
					onClick={() => onChangePreset(4)}
				>
					<PresetFour />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() => onChangePreset(5)}
				>
					<PresetFive />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() => onChangePreset(6)}
				>
					<PresetSix />
				</span>
			</div>
		</div>
	);
};

export default PresetsIcons;
