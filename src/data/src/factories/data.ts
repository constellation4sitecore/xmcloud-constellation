import { LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { DataService } from '../services/data-service';

export const createDataService = (layoutData: LayoutServiceData): DataService => {
  const labelService = new DataService(layoutData);
  return labelService;
};
