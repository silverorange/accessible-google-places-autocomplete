declare module 'react-load-script' {
  import * as React from 'react';

  export interface ScriptProps {
    onCreate?: () => void;
    onError?: () => void;
    onLoad?: () => void;
    url: string;
    attributes?: any;
  }

  export default class Script extends React.Component<ScriptProps, any> {}
}
