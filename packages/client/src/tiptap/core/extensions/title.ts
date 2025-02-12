import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { getDatasetAttribute, isInTitle } from 'tiptap/prose-utils';

import { TitleWrapper } from '../wrappers/title';

export interface TitleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    title: {
      setTitle: (attributes) => ReturnType;
      toggleTitle: (attributes) => ReturnType;
    };
  }
}

export const TitleExtensionName = 'title';

export const Title = Node.create<TitleOptions>({
  name: TitleExtensionName,
  content: 'inline*',
  group: 'block',
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'title',
      },
    };
  },

  addAttributes() {
    return {
      cover: {
        default: '',
        parseHTML: getDatasetAttribute('cover'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=title]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TitleWrapper);
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(this.name),
        props: {
          handleKeyDown(view, evt) {
            const { state, dispatch } = view;

            if (isInTitle(view.state) && evt.code === 'Enter') {
              evt.preventDefault();

              const paragraph = state.schema.nodes.paragraph;

              if (!paragraph) {
                return;
              }

              const $head = state.selection.$head;
              const titleNode = $head.node($head.depth);
              const endPos = ((titleNode.firstChild && titleNode.firstChild.nodeSize) || 0) + 1;

              dispatch(state.tr.insert(endPos, paragraph.create()));

              const newState = view.state;
              const next = new TextSelection(newState.doc.resolve(endPos + 2));
              dispatch(newState.tr.setSelection(next));
              return true;
            }
          },
        },
      }),
    ];
  },
});
