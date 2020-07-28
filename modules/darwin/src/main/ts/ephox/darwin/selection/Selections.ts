import { Optional } from '@ephox/katamari';
import { SugarElement } from '@ephox/sugar';
import * as SelectionTypes from './SelectionTypes';
import * as TableSelection from '../api/TableSelection';

export interface Selections {
  get: () => SelectionTypes.SelectionType;
}

// tslint:disable-next-line:variable-name
export const Selections = (root: SugarElement<Element>, getStart: () => Optional<SugarElement<HTMLTableCellElement | HTMLTableCaptionElement>>, selectedSelector: string): Selections => {
  const get = () => TableSelection.retrieve(root, selectedSelector).fold(
    () => getStart().map(SelectionTypes.single).getOr(SelectionTypes.none()),
    (cells: SugarElement<Element>[]) => SelectionTypes.multiple(cells)
  );

  return {
    get
  };
};