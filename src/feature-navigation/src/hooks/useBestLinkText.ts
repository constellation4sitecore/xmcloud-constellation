import { TargetItem } from '../models';

function useBestLinkText(items: TargetItem[]): TargetItem[];
function useBestLinkText(item: TargetItem): TargetItem;

function useBestLinkText(items: TargetItem | TargetItem[]): TargetItem | TargetItem[] {
  if (Array.isArray(items)) {
    // Handle case where items is an array
    return items.map((targetItem) => ({
      ...targetItem,
      bestLinkText: targetItem.fields?.navigationTitle?.value
        ? targetItem.fields.navigationTitle.value
        : targetItem.displayName,
    }));
  } else {
    // Handle case where items is a single item
    const targetItem = items;
    return {
      ...targetItem,
      bestLinkText: targetItem.fields?.navigationTitle?.value
        ? targetItem.fields.navigationTitle.value
        : targetItem.displayName,
    };
  }
}
export default useBestLinkText;
