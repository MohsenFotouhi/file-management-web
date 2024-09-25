export interface TableColumn<T> {
showDetails?: any;
  label: string;
  property: string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'list' | 'expandable';
  visible?: boolean;
  cssClasses?: string[];
}
