import { ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { NavigationLink } from './navigation-link';

export interface ImageNavigationLink extends NavigationLink {
  image: ImageField;
}
