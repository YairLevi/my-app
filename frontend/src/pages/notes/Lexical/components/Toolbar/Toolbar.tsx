import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import "@/pages/notes/Lexical/editorTheme.css";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eraser,
  Highlighter,
  Indent,
  Italic,
  Link,
  Outdent,
  RotateCcw,
  RotateCw,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  Underline
} from 'lucide-react'
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  DEPRECATED_$isGridSelection,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_MODIFIER_COMMAND,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from "lexical";
import { blockTypeToBlockName, FormatDropdown } from "@/pages/notes/Lexical/components/Toolbar/Format/FormatDropdown";
import { FontDropDown } from "@/pages/notes/Lexical/components/Toolbar/Font/FontSizeDropdown";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister
} from "@lexical/utils";
import { $getSelectionStyleValueForProperty, $isParentElementRTL, $patchStyleText } from "@lexical/selection";
import getSelectedNode from "@/pages/notes/Lexical/utils/getSelectedNode";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isCodeNode, CODE_LANGUAGE_MAP } from "@lexical/code";
import DropdownColorPicker from './Font/DropdownColorPicker'
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";


function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#000");
  const [bgColor, setBgColor] = useState<string>("#fff");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  //   const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const IS_APPLE = false;

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000")
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      );
      setElementFormat(
        ($isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType()) || 'left',
      );
    }
  }, [activeEditor]);
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);
  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [activeEditor, editor, updateToolbar]);
  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          return activeEditor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            sanitizeUrl('https://'),
          );
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, isLink])

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "www.google.com");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor],
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ 'background-color': value });
    },
    [applyStyleText],
  );

  const SUPPORTED_URL_PROTOCOLS = new Set([
    'http:',
    'https:',
    'mailto:',
    'sms:',
    'tel:',
  ]);

  function sanitizeUrl(url: string): string {
    try {
      const parsedUrl = new URL(url)
      if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
        return 'about:blank';
      }
    } catch {
      return url;
    }
    return url;
  }

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            if (idx === 0 && anchor.offset !== 0) {
              node = node.splitText(anchor.offset)[1] || node;
            }
            if (idx === nodes.length - 1) {
              node = node.splitText(focus.offset)[0] || node;
            }

            if (node.__style !== '') {
              node.setStyle('');
            }
            if (node.__format !== 0) {
              node.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(node).setFormat('');
            }
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const FORMAT_TYPES = {
    left: "left",
    center: "center",
    right: "right",
    justify: "justify",
  }

  function strikeThroughOnClick() {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
  }

  function clearFormattingOnClick() {
    clearFormatting()
  }

  function superscriptOnClick() {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
  }

  function subscriptOnClick() {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
  }


  return (
    <div className="flex bg-gray-100 h-fit border-b [&_*]:!text-gray-600 items-center gap-1 p-1">
      <div id="undo-redo- contianer" className="items-center w-fit flex justify-evenly">
        <RotateCcw
          className="p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600"
          size={32}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        />
        <RotateCw
          className="p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600"
          size={32}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        />
      </div>
      <div className="h-full bg-gray-300 w-[1px]"/>
      <FormatDropdown/>
      <div className="h-full bg-gray-300 w-[1px]"/>
      <FontDropDown
        editor={editor}
        value={fontSize}
        style={"font-size"}
      />
      <FontDropDown
        editor={editor}
        value={fontFamily}
        style={"font-family"}
      />
      <div className="h-full bg-gray-300 w-[1px]"/>
      <Bold
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isBold && "bg-gray-300"}`}
        strokeWidth={4}
        size={32}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
      />
      <Italic
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isItalic && "bg-gray-300"}`}
        size={32}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
      />
      <Underline
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isUnderline && "bg-gray-300"}`}
        size={32}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
      />
      <Code
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isCode && "bg-gray-300"}`}
        size={32}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
      />
      <Link
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isLink && "bg-gray-300"}`}
        size={32}
        onClick={insertLink}
      />
      <div className="h-full bg-gray-300 w-[1px]"/>
      <DropdownColorPicker
        disabled={!isEditable}
        buttonClassName="toolbar-item color-picker"
        buttonAriaLabel="Formatting text color"
        buttonIconClassName="icon font-color"
        color={fontColor}
        onChange={onFontColorSelect}
        value={<Type size={32} className="p-2 -ml-2"/>}
        title="text color"
      />
      <DropdownColorPicker
        disabled={!isEditable}
        buttonClassName="toolbar-item color-picker"
        buttonAriaLabel="Formatting background color"
        buttonIconClassName="icon bg-color"
        color={bgColor}
        onChange={onBgColorSelect}
        value={<Highlighter size={32} className="p-2 -ml-2"/>}
        title="bg color"
      />
      <div className="h-full bg-gray-300 w-[1px]"/>
      <Superscript
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isSuperscript && "bg-gray-300"}`}
        size={32}
        onClick={superscriptOnClick}
      />
      <Subscript
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isSubscript && "bg-gray-300"}`}
        size={32}
        onClick={subscriptOnClick}
      />
      <Strikethrough
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isStrikethrough && "bg-gray-300"}`}
        size={32}
        onClick={strikeThroughOnClick}
      />
      <Eraser
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600`}
        size={32}
        onClick={clearFormattingOnClick}
      />
      <div className="h-full bg-gray-300 w-[1px]"/>
      <AlignLeft
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${elementFormat == FORMAT_TYPES.left && "bg-gray-300"}`}
        size={32}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
      />
      <AlignCenter
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${elementFormat == FORMAT_TYPES.center && "bg-gray-300"}`}
        size={32}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
      />
      <AlignRight
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${elementFormat == FORMAT_TYPES.right && "bg-gray-300"}`}
        size={32}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
      />
      <AlignJustify
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${elementFormat == FORMAT_TYPES.justify && "bg-gray-300"}`}
        size={32}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
      />
      <div className="h-full bg-gray-300 w-[1px]"/>
      <Indent
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isLink && "bg-gray-300"}`}
        size={32}
        onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
      />
      <Outdent
        className={`p-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer text-gray-600 ${isLink && "bg-gray-300"}`}
        size={32}
        onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
      />
    </div>
  );
};

export default Toolbar;
