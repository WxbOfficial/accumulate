
let currentReplayingEvent = null;

export function setReplayingEvent(event) {

  if (currentReplayingEvent !== null) {
    console.error(
      'Expected currently replaying event to be null. This error ' +
        'is likely caused by a bug in React. Please file an issue.',
    );
  }

  currentReplayingEvent = event;
}

export function resetReplayingEvent() {

  if (currentReplayingEvent === null) {
    console.error(
      'Expected currently replaying event to not be null. This error ' +
        'is likely caused by a bug in React. Please file an issue.',
    );
  }

  currentReplayingEvent = null;
}

export function isReplayingEvent(event) {
  return event === currentReplayingEvent;
}
