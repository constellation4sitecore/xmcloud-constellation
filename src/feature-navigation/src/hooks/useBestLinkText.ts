import { BasePageFields, BaseTargetItem } from '../models/target-item';

function useBestLinkText<T extends BasePageFields>(items: BaseTargetItem<T>[]): BaseTargetItem<T>[];
function useBestLinkText<T extends BasePageFields>(item: BaseTargetItem<T>): BaseTargetItem<T>;

function useBestLinkText<T extends BasePageFields>(
  items: BaseTargetItem<T> | BaseTargetItem<T>[]
): BaseTargetItem<T> | BaseTargetItem<T>[] {
  if (Array.isArray(items)) {
    // Handle case where items is an array
    return items.map((targetItem) => ({
      ...targetItem,
      bestLinkText: targetItem.fields?.NavigationTitle?.value
        ? targetItem.fields.NavigationTitle.value
        : targetItem.displayName,
    }));
  } else {
    // Handle case where items is a single item
    const targetItem = items;
    return {
      ...targetItem,
      bestLinkText: targetItem.fields?.NavigationTitle?.value
        ? targetItem.fields.NavigationTitle.value
        : targetItem.displayName,
    };
  }
}
export default useBestLinkText;
