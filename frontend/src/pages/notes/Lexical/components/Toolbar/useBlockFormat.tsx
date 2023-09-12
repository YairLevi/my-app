import {ReactElement} from "react";
import {$createParagraphNode, $getSelection, $isRangeSelection, DEPRECATED_$isGridSelection} from "lexical";
import {$setBlocksType} from "@lexical/selection";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode, HeadingTagType, } from '@lexical/rich-text';
import {blockTypeToBlockName} from "../../constants";
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, } from '@lexical/list';
import {$createCodeNode} from "@lexical/code";
import {UseBlockFormatProps} from "../../types";
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code
} from 'lucide-react'

export function useBlockFormat(props: UseBlockFormatProps) {
  const {blockType} = props;
  const [editor] = useLexicalComposerContext();

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        )
          $setBlocksType(selection, () => $createParagraphNode());
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () =>
            $createHeadingNode(headingSize),
          );
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };


  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  interface Block {
    name: string;
    blockType: keyof typeof blockTypeToBlockName;
    icon: ReactElement<any>;
    // onClick?: MouseEventHandler<HTMLButtonElement>;
    onClick: () => void;
  }

  const blocks: Block[] = [
    {
      name: 'Normal',
      blockType: 'paragraph',
      icon: <Text size={20}/>,
      onClick: formatParagraph,
    },
    {
      name: 'Heading 1',
      blockType: 'h1',
      icon: <Heading1 size={20}/>,
      onClick: () => formatHeading("h1")
    },
    {
      name: 'Heading 2',
      blockType: 'h2',
      icon: <Heading2 size={20}/>,
      onClick: () => formatHeading("h2")
    },
    {
      name: 'Heading 3',
      blockType: 'h3',
      icon: <Heading3 size={20}/>,
      onClick: () => formatHeading("h3")
    },
    {
      name: "Quote",
      blockType: 'quote',
      icon: <Quote size={16}/>,
      onClick: formatQuote,
    },
    {
      name: 'Bulleted List',
      blockType: 'bullet',
      icon: <List size={20}/>,
      onClick: formatBulletList,
    },
    {
      name: 'Numbered List',
      blockType: 'number',
      icon: <ListOrdered size={20}/>,
      onClick: formatNumberedList,
    },
    {
      name: 'Check List',
      blockType: 'check',
      icon: <CheckSquare size={20}/>,
      onClick: formatCheckList,
    },
    {
      name: "Code Block",
      blockType: 'code',
      icon: <Code size={20}/>,
      onClick: formatCode
    },
  ];

  return {
    blocks,
    formatParagraph,
    formatHeading,
    formatBulletList,
    formatCheckList,
    formatNumberedList,
    formatQuote,
    formatCode,
  };
}
