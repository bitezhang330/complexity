const queryBoxSelectors = [
  {
    id: 'focus-selector',
    label: 'Web search focus',
    storeKey: 'focus',
  },
  {
    id: 'collection-selector',
    label: 'Collection',
    storeKey: 'collection',
  },
  {
    id: 'language-model-selector',
    label: 'Language Model',
    storeKey: 'languageModel',
  },
  {
    id: 'image-gen-model-selector',
    label: 'Image Generation Model',
    storeKey: 'imageGenModel',
  },
] as const;

const qolTweaks = [
  {
    id: 'thread-toc',
    label: 'Thread TOC',
    storeKey: 'threadTOC',
  },
  {
    id: 'quick-query-commander',
    label: 'Inline query params invocation',
    storeKey: 'quickQueryCommander',
  },
  {
    id: 'code-block-enhanced-toolbar',
    label: 'Code block enhanced toolbar',
    storeKey: 'codeBlockEnhancedToolbar',
  },
] as const;

const visualTweaks = [
  {
    id: 'thread-query-markdown',
    label: 'Thread query markdown (&double click to edit query)',
    storeKey: 'threadQueryMarkdown',
  },
  // {
  //   id: 'chat-ui', // image & avatar on top of every messages
  //   label: 'Chat UI',
  //   storeKey: 'chatUI',
  // },
  {
    id: 'collapse-empty-visual-columns',
    label: 'Collapse empty thread visual columns',
    storeKey: 'collapseEmptyThreadVisualColumns',
  },
  // {
  //   id: 'wider-thread-width',
  //   label: 'Wider thread width',
  //   storeKey: 'widerThreadWidth',
  // },
] as const;

const popupSettings = {
  queryBoxSelectors,
  qolTweaks,
  visualTweaks,
};

export default popupSettings;
