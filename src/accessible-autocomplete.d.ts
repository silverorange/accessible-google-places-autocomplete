declare module 'accessible-autocomplete/react' {
  import * as React from 'react';

  export interface AutocompleteProps {
    autoselect?: boolean;
    confirmOnBlur?: boolean;
    cssNamespace?: string;
    defaultValue?: string;
    displayMenu?: 'inline' | 'overlay';
    id: string;
    onConfirm?: (confirmed: any) => void;
    minLength?: number;
    name?: string;
    required?: boolean;
    showAllValues?: boolean;
    showNoResultsFound?: boolean;
    source: (query: string, populateResults: any) => void | string[];
    tNoResults?: () => string;
    tStatusQueryTooShort?: (minLength: number) => string;
    tStatusNoResults?: () => string;
    tStatusSelectedOption?: (selectedOption: string, length: number) => string;
    tStatusResults?: (length: number, contentSelectedOption: string) => string;
  }

  export default class Autocomplete extends React.Component<
    AutocompleteProps,
    any
  > {}
}
