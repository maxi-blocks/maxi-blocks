/**
 * Gutenberg Extra Block component extension
 */

/**
 * Internal dependencies
 */
import GXComponent from '../gx-component';

/**
 * Class
 */
class GXBlock extends GXComponent {
    uniqueIDChecker(idToCheck) {
        if (document.getElementsByClassName(idToCheck).length > 1) {
            let newUniqueId = idToCheck + (Math.random() * 100).toFixed(0);
            let newUniqueIdNum = newUniqueId.match(/\d+$/)[0];

            if (newUniqueIdNum.length > 3) {
                const rawUniqueId = newUniqueId.replace(newUniqueIdNum, '');

                while (newUniqueIdNum.length > 3) {
                    newUniqueIdNum = (Number(newUniqueIdNum) / 2).toFixed(0).toString();
                }

                newUniqueId = rawUniqueId + newUniqueIdNum;
            }

            this.uniqueIDChecker(newUniqueId);

            this.props.setAttributes({ uniqueID: newUniqueId })
        }
    }
}

export default GXBlock;