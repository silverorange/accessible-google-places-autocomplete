import * as get from 'get-value';

export function translate(message: string, context: any): string {
  const messages = {
    addressAutoComplete: {
      noResults: 'Address not found',
      statusNoResults: 'No matching addresses',
      statusResults:
        '%{smart_count} matching address is available |||| %{smart_count} matching addresses are available',
      statusSelectedOption: 'You’ve selected %{option}'
    }
  };

  let translation = get(messages, message);

  if (!context) {
    return translation;
  }

  if (!translation) {
    return message;
  }

  // Support English plurals. More complex requirements should use an external
  // i18n library like Polyglot.
  if (context.smart_count !== undefined) {
    const pluralForms = translation.split('||||');
    const pluralIndex = context.smart_count === 1 ? 0 : 1;
    translation = pluralForms[pluralIndex].trim();
  }

  // Interpolate results.
  return translation.replace(
    /%\{(.*?)\}/g,
    (match: string, contextKey: string): string => {
      if (context[contextKey] === undefined) {
        return match;
      }
      if (typeof context[contextKey] === 'string') {
        return context[contextKey].replace(/\$/g, '$$');
      }
      return context[contextKey];
    }
  );
}
