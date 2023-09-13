import Dropdown, { useDropdown } from "@/components/Dropdown";
import { ReactElement, useCallback, useEffect } from "react";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { $patchStyleText } from "@lexical/selection";

type FontOptionProps = {
  name: string,
}

function FontOption(props: FontOptionProps) {
  const { name } = props

  return (
    <div className="flex items-center gap-2">
      {name}
    </div>
  )
}

//
// function $patchStyle(target: TextNode | RangeSelection, patch: Record<string, string | null>,): void {
//   const prevStyles = getStyleObjectFromCSS(
//     'getStyle' in target ? target.getStyle() : target.style,
//   );
//   const newStyles = Object.entries(patch).reduce<Record<string, string>>(
//     (styles, [key, value]) => {
//       if (value === null) {
//         delete styles[key];
//       } else {
//         styles[key] = value;
//       }
//       return styles;
//     },
//     {...prevStyles} || {},
//   );
//   const newCSSText = getCSSFromStyleObject(newStyles);
//   target.setStyle(newCSSText);
//   CSS_TO_STYLES.set(newCSSText, newStyles);
// }
//
// function $patchStyleText(selection: RangeSelection | GridSelection, patch: Record<string, string | null>,): void {
//   const selectedNodes = selection.getNodes();
//   const selectedNodesLength = selectedNodes.length;
//
//   if (DEPRECATED_$isGridSelection(selection)) {
//     const cellSelection = $createRangeSelection();
//     const cellSelectionAnchor = cellSelection.anchor;
//     const cellSelectionFocus = cellSelection.focus;
//     for (let i = 0; i < selectedNodesLength; i++) {
//       const node = selectedNodes[i];
//       if (DEPRECATED_$isGridCellNode(node)) {
//         cellSelectionAnchor.set(node.getKey(), 0, 'element');
//         cellSelectionFocus.set(
//           node.getKey(),
//           node.getChildrenSize(),
//           'element',
//         );
//         $patchStyleText(
//           $normalizeSelection__EXPERIMENTAL(cellSelection),
//           patch,
//         );
//       }
//     }
//     $setSelection(selection);
//     return;
//   }
//
//   const lastIndex = selectedNodesLength - 1;
//   let firstNode = selectedNodes[0];
//   let lastNode = selectedNodes[lastIndex];
//
//   if (selection.isCollapsed()) {
//     $patchStyle(selection, patch);
//     return;
//   }
//
//   const anchor = selection.anchor;
//   const focus = selection.focus;
//   const firstNodeText = firstNode.getTextContent();
//   const firstNodeTextLength = firstNodeText.length;
//   const focusOffset = focus.offset;
//   let anchorOffset = anchor.offset;
//   const isBefore = anchor.isBefore(focus);
//   let startOffset = isBefore ? anchorOffset : focusOffset;
//   let endOffset = isBefore ? focusOffset : anchorOffset;
//   const startType = isBefore ? anchor.type : focus.type;
//   const endType = isBefore ? focus.type : anchor.type;
//   const endKey = isBefore ? focus.key : anchor.key;
//
//   // This is the case where the user only selected the very end of the
//   // first node so we don't want to include it in the formatting change.
//   if ($isTextNode(firstNode) && startOffset === firstNodeTextLength) {
//     const nextSibling = firstNode.getNextSibling();
//
//     if ($isTextNode(nextSibling)) {
//       // we basically make the second node the firstNode, changing offsets accordingly
//       anchorOffset = 0;
//       startOffset = 0;
//       firstNode = nextSibling;
//     }
//   }
//
//   // This is the case where we only selected a single node
//   if (selectedNodes.length === 1) {
//     if ($isTextNode(firstNode)) {
//       startOffset =
//         startType === 'element'
//           ? 0
//           : anchorOffset > focusOffset
//             ? focusOffset
//             : anchorOffset;
//       endOffset =
//         endType === 'element'
//           ? firstNodeTextLength
//           : anchorOffset > focusOffset
//             ? anchorOffset
//             : focusOffset;
//
//       // No actual text is selected, so do nothing.
//       if (startOffset === endOffset) {
//         return;
//       }
//
//       // The entire node is selected, so just format it
//       if (startOffset === 0 && endOffset === firstNodeTextLength) {
//         $patchStyle(firstNode, patch);
//         firstNode.select(startOffset, endOffset);
//       } else {
//         // The node is partially selected, so split it into two nodes
//         // and style the selected one.
//         const splitNodes = firstNode.splitText(startOffset, endOffset);
//         const replacement = startOffset === 0 ? splitNodes[0] : splitNodes[1];
//         $patchStyle(replacement, patch);
//         replacement.select(0, endOffset - startOffset);
//       }
//     } // multiple nodes selected.
//   } else {
//     if (
//       $isTextNode(firstNode) &&
//       startOffset < firstNode.getTextContentSize()
//     ) {
//       if (startOffset !== 0) {
//         // the entire first node isn't selected, so split it
//         firstNode = firstNode.splitText(startOffset)[1];
//         startOffset = 0;
//       }
//
//       $patchStyle(firstNode as TextNode, patch);
//     }
//
//     if ($isTextNode(lastNode)) {
//       const lastNodeText = lastNode.getTextContent();
//       const lastNodeTextLength = lastNodeText.length;
//
//       // The last node might not actually be the end node
//       //
//       // If not, assume the last node is fully-selected unless the end offset is
//       // zero.
//       if (lastNode.__key !== endKey && endOffset !== 0) {
//         endOffset = lastNodeTextLength;
//       }
//
//       // if the entire last node isn't selected, split it
//       if (endOffset !== lastNodeTextLength) {
//         [lastNode] = lastNode.splitText(endOffset);
//       }
//
//       if (endOffset !== 0) {
//         $patchStyle(lastNode as TextNode, patch);
//       }
//     }
//
//     // style all the text nodes in between
//     for (let i = 1; i < lastIndex; i++) {
//       const selectedNode = selectedNodes[i];
//       const selectedNodeKey = selectedNode.getKey();
//
//       if (
//         $isTextNode(selectedNode) &&
//         selectedNodeKey !== firstNode.getKey() &&
//         selectedNodeKey !== lastNode.getKey() &&
//         !selectedNode.isToken()
//       ) {
//         $patchStyle(selectedNode, patch);
//       }
//     }
//   }
// }

export function FontDropDown({
                               editor,
                               value,
                               style,
                               disabled = false,
                             }: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): ReactElement {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';

  const FONT_FAMILY_OPTIONS = [
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
  ];

  const FONT_SIZE_OPTIONS = [
    '10px',
    '11px',
    '12px',
    '13px',
    '14px',
    '15px',
    '16px',
    '17px',
    '18px',
    '19px',
    '20px',
  ];

  const FONT_STYLE = (style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS)

  const {
    onSelect,
    toggleOpen,
    open,
    selectedOption,
    options,
  } = useDropdown(FONT_STYLE)

  useEffect(() => {
    console.log(open)
  }, [open]);

  return (
    <Dropdown>
      <Dropdown.Picker
        onClick={toggleOpen}
        open={open}
        className="hover:bg-gray-300"
        value={<FontOption name={value}/>}
      />
      <Dropdown.Menu open={open}>
        {
          options.map((option, idx) => (
            <Dropdown.Item
              isSelected={selectedOption == option}
              onClick={() => {
                onSelect(idx)()
                handleClick(option)
              }}
            >
              <FontOption key={"font" + idx} name={option}/>
            </Dropdown.Item>
          ))
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}