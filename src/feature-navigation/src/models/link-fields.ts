import { NavigationLink } from './navigation-link';

export interface LinkFields {
  id: string;
  displayName: string;
  name: string;
  url: string;
  fields: NavigationLink;
}
