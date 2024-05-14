type TemplateInfo = {
  id: string;
  name: string;
};
type ItemInfo = {
  id: string;
  name: string;
  template: {
    id: string;
    name: string;
    baseTemplates: TemplateInfo[];
  };
};

export declare function getItemTemplateInfo(itemId: string): Promise<ItemInfo | null>;
