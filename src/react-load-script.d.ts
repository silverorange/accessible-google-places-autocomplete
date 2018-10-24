declare module 'react-load-script' {
  import * as React from 'react';

  interface ScriptProps {
    onCreate?: () => void;
    onError?: () => void;
    onLoad?: () => void;
    url: string;
    attributes?: any;
  }

  class Script extends React.Component<ScriptProps, any> {
    public static loadedScripts: Record<string, boolean>;
    public static erroredScripts: Record<string, boolean>;
    public static scriptObservers: Record<string, any>;
  }

  // react-load-script exports the component as both a default
  // (exports.default = Foo) and as an immediate class (module.exports = Foo).
  // This hack to allows importing in Typescript as a namespace and using as a
  // class.
  namespace Script {

  }

  export = Script;
}
