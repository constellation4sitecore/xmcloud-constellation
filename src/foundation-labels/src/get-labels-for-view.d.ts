// https://stackoverflow.com/questions/56018167/typescript-does-not-copy-d-ts-files-to-build
// .d.ts workaraound
type Obj = { [key: string]: unknown };

export declare function getLabelsForView<TLabel extends Obj>(
  labelId: string
): Promise<TLabel | null>;
