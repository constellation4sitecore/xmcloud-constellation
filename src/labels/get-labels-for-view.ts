type Obj = { [key: string]: unknown };

export declare function getLabelsForView<TLabel extends Obj>(
  labelId: string
): Promise<TLabel | null>;
