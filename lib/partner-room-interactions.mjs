/** @param {{ heroVisible: boolean, formVisible: boolean }} visibility */
export function shouldShowMobileCta({ heroVisible, formVisible }) {
  return !heroVisible && !formVisible;
}
