import $ from 'jquery';

export type OnElementExistOptions<T> = {
  selector:
    | string
    | (() => Element[])
    | (() => {
        element: Element;
        args: T;
      }[]);
  callback: (args: {
    element: Element;
    args?: T;
    reobserve: () => void;
  }) => void;
  recurring?: boolean;
  observedIdentifier?: string;
};

function onElementExist<T>({
  selector,
  callback,
  recurring = true,
  observedIdentifier,
}: OnElementExistOptions<T>): MutationObserver {
  requestIdleCallback(() => {
    checkAndInvokeCallback();
  });

  const observer = new MutationObserver(() => {
    checkAndInvokeCallback();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  function checkAndInvokeCallback() {
    let elements;

    if (isStringSelector(selector)) {
      elements = $(selector).toArray();
    } else if (isElementArraySelector(selector)) {
      elements = selector();
    } else if (isElementWithArgsArraySelector(selector)) {
      elements = selector().map((item) => item.element);
    }

    elements?.forEach((element) => {
      if (!document.contains(element)) return;

      if (observedIdentifier && $(element).data(observedIdentifier) === true) {
        return;
      }

      callback({
        element,
        args: isElementWithArgsArraySelector(selector)
          ? selector().find((item) => item.element === element)?.args
          : undefined,
        reobserve: () =>
          observedIdentifier
            ? $(element).data(observedIdentifier, false)
            : null,
      });

      if (observedIdentifier) {
        $(element).data(observedIdentifier, true);
        $(element).attr(`data-${observedIdentifier}`, 'true');
      }

      if (!recurring) {
        observer.disconnect();
      }
    });
  }

  return observer;

  function isStringSelector(selector: any): selector is string {
    return typeof selector === 'string';
  }

  function isElementArraySelector(selector: any): selector is () => Element[] {
    return (
      typeof selector === 'function' &&
      Array.isArray(selector()) &&
      selector().every((el: any) => el instanceof Element)
    );
  }

  function isElementWithArgsArraySelector(
    selector: any
  ): selector is () => { element: Element; args: T }[] {
    return (
      typeof selector === 'function' &&
      Array.isArray(selector()) &&
      selector().every((item: any) => item?.element instanceof Element)
    );
  }
}

function onElementRemoved({
  selector,
  callback,
}: {
  selector: Element;
  callback: () => void;
}): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.removedNodes.length > 0) {
        mutation.removedNodes.forEach((node) => {
          if (node === selector) {
            callback();
            observer.disconnect();
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}

function onAttributeChanges({
  targetNode,
  attributes,
  immediateInvoke = false,
  callback,
}: {
  targetNode: HTMLElement;
  attributes: string[];
  immediateInvoke?: boolean;
  callback: ({
    mutation,
    targetNode,
  }: {
    targetNode: Element;
    mutation: MutationRecord;
  }) => void;
}): MutationObserver {
  // TODO: disconnect observer when no longer needed

  if (immediateInvoke)
    callback({ targetNode, mutation: { attributeName: '' } as MutationRecord });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        attributes.includes(mutation.attributeName!)
      ) {
        callback({ targetNode, mutation });
      }
    });
  });

  observer.observe(targetNode, {
    attributes: true,
    attributeFilter: attributes,
  });

  return observer;
}

function onDOMChanges({
  targetNode,
  callback,
  recurring = false,
}: {
  targetNode: Node | null;
  callback: (mutation: MutationRecord) => void;
  recurring?: boolean;
}): (() => void) | null {
  if (!targetNode || typeof callback !== 'function') return null;

  const observerConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  };

  let observer: MutationObserver;

  const startObserving = () => {
    observer = new MutationObserver((mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        callback(mutation);
      }
      if (!document.body.contains(targetNode)) {
        observer.disconnect();

        if (recurring) {
          const checkExistence = setInterval(() => {
            if (document.body.contains(targetNode)) {
              clearInterval(checkExistence);
              startObserving();
            }
          }, 1000);
        }
      }
    });
    observer.observe(targetNode, observerConfig);
  };

  const checkNodeExistence = () => {
    if (document.body.contains(targetNode)) {
      startObserving();
    } else if (recurring) {
      const checkExistence = setInterval(() => {
        if (document.body.contains(targetNode)) {
          clearInterval(checkExistence);
          startObserving();
        }
      }, 1000);
    }
  };

  checkNodeExistence();

  return () => observer.disconnect();
}

function onNewElementAdded({
  targetNode,
  callback,
  recurring = false,
}: {
  targetNode: Node | null;
  callback: (mutation: MutationRecord) => void;
  recurring?: boolean;
}): (() => void) | null {
  if (!targetNode || typeof callback !== 'function') return null;

  const observerConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
  };

  let observer: MutationObserver;

  const startObserving = () => {
    observer = new MutationObserver((mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          callback(mutation);
        }
      }
      if (recurring && !document.body.contains(targetNode)) {
        observer.disconnect();
        const checkExistence = setInterval(() => {
          if (document.body.contains(targetNode)) {
            clearInterval(checkExistence);
            startObserving();
          }
        }, 1000);
      }
    });
    observer.observe(targetNode, observerConfig);
  };

  const checkNodeExistence = () => {
    if (document.body.contains(targetNode)) {
      startObserving();
    } else if (recurring) {
      const checkExistence = setInterval(() => {
        if (document.body.contains(targetNode)) {
          clearInterval(checkExistence);
          startObserving();
        }
      }, 1000);
    }
  };

  checkNodeExistence();

  return () => observer.disconnect();
}

function onShallowRouteChange(callback: () => void) {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;

      callback();
    }
  }).observe(document, { subtree: true, childList: true });
}

type ScrollCallback = () => void;

function onScrollDirectionChange({
  up,
  down,
  identifier,
}: {
  up?: ScrollCallback;
  down?: ScrollCallback;
  identifier: string;
}) {
  let lastScrollTop = 0;

  $(window).on(`scroll.${identifier}`, function () {
    const currentScrollTop = $(this).scrollTop();

    if (typeof currentScrollTop === 'undefined') return;

    if (currentScrollTop > lastScrollTop) {
      down?.();
    } else {
      up?.();
    }

    lastScrollTop = currentScrollTop;
  });

  return () => $(window).off(`scroll.${identifier}`);
}

const observer = {
  onElementExist,
  onElementRemoved,
  onAttributeChanges,
  onShallowRouteChange,
  onDOMChanges,
  onNewElementAdded,
  onScrollDirectionChange,
};

export default observer;
