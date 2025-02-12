import { IUser } from '@think/domains';
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FlowWrapper } from 'tiptap/core/wrappers/flow';
import { getDatasetAttribute } from 'tiptap/prose-utils';

export interface IFlowAttrs {
  width?: number | string;
  height?: number;
  data?: string;
  defaultShowPicker?: boolean;
  createUser?: IUser['id'];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    flow: {
      setFlow: (attrs?: IFlowAttrs) => ReturnType;
    };
  }
}

export const Flow = Node.create({
  name: 'flow',
  group: 'block',
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      width: {
        default: null,
        parseHTML: getDatasetAttribute('width'),
      },
      height: {
        default: 240,
        parseHTML: getDatasetAttribute('height'),
      },
      data: {
        default: '',
        parseHTML: getDatasetAttribute('data'),
      },
      defaultShowPicker: {
        default: false,
      },
      createUser: {
        default: null,
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'flow',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setFlow:
        (options) =>
        ({ tr, commands, chain, editor }) => {
          options = options || {};
          options.data = options.data || '';

          // @ts-ignore
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options);
          }

          const { selection } = editor.state;
          const pos = selection.$head;
          return chain()
            .insertContentAt(pos.before(), [
              {
                type: this.name,
                attrs: options,
              },
            ])
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FlowWrapper);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$flow $/,
        type: this.type,
        getAttributes: (match) => {
          return { type: match[1] };
        },
      }),
    ];
  },
});
