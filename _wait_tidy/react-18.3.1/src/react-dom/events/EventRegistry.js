
export const allNativeEvents = new Set();

/**
 * Mapping from registration name to event name
 */
export const registrationNameDependencies = {};

/**
 * Mapping from lowercase registration names to the properly cased version,
 * used to warn in the case of missing event handlers. Available
 * only in __DEV__.
 * @type {Object}
 */
export const possibleRegistrationNames = {};
// Trust the developer to only use possibleRegistrationNames in __DEV__

export function registerTwoPhaseEvent(
  registrationName,
  dependencies,
) {
  registerDirectEvent(registrationName, dependencies);
  registerDirectEvent(registrationName + 'Capture', dependencies);
}

export function registerDirectEvent(
  registrationName,
  dependencies,
) {
  if (registrationNameDependencies[registrationName]) {
    console.error(
      'EventRegistry: More than one plugin attempted to publish the same ' +
        'registration name, `%s`.',
      registrationName,
    );
  }

  registrationNameDependencies[registrationName] = dependencies;

  const lowerCasedName = registrationName.toLowerCase();
  possibleRegistrationNames[lowerCasedName] = registrationName;

  if (registrationName === 'onDoubleClick') {
    possibleRegistrationNames.ondblclick = registrationName;
  }

  for (let i = 0; i < dependencies.length; i++) {
    allNativeEvents.add(dependencies[i]);
  }
}
