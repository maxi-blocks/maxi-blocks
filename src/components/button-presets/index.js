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
	PresetSeven,
	PresetEight,
} from '../../icons';

/**
 * Styles
 */
import './editor.scss';

const PresetsIcons = () => {
	return (
		<div className='maxi-button-presets'>
			<div className='maxi-button-presets__icons-group'>
				<span className='maxi-button-presets__icon'>
					<PresetOne />
				</span>
				<span className='maxi-button-presets__icon'>
					<PresetTwo />
				</span>
				<span className='maxi-button-presets__icon'>
					<PresetThree />
				</span>
			</div>

			<div className='maxi-button-presets__icons-group'>
				<span className='maxi-button-presets__icon'>
					<PresetFour />
				</span>
				<span className='maxi-button-presets__icon'>
					<PresetFive />
				</span>
				<span className='maxi-button-presets__icon'>
					<PresetSix />
				</span>
			</div>

			<div className='maxi-button-presets__icons-group'>
				<span className='maxi-button-presets__icon'>
					<PresetSeven />
				</span>
				<span className='maxi-button-presets__icon'>
					<PresetEight />
				</span>
			</div>
		</div>
	);
};

export default PresetsIcons;
