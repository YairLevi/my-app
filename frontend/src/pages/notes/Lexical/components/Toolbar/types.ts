import React, {ReactElement} from "react";
import {ElementFormatType, TextFormatType} from "lexical";
import {blockTypeToBlockName} from "./constants";

export type DebouncedFunctionType = (...params: any[]) => void;

export interface AlignMenuItem {
    name: string;
    icon: ReactElement,
    payload: ElementFormatType
}

export interface FormatTextMenuItem {
    name: string;
    icon: ReactElement,
    payload: TextFormatType
}

export interface ToolbarProps {
    editable: boolean;
}

export interface FormatTextMenuProps {
    hasFormat: Record<TextFormatType, boolean>;
}

export interface ColorPickerProps {
    title: string;
    onChange: (color: string) => void;
    icon?: React.ReactElement;
}

export interface BlockFormatMenuProps {
    blockType: keyof typeof blockTypeToBlockName;
}

export interface PlaceholderProps {
    className?: string;
    children?: React.ReactNode;
}

export interface IMenuButtonStyle {
    open: boolean;
    isMdViewport: boolean;
}

export interface UseBlockFormatProps {
    blockType: keyof typeof blockTypeToBlockName;
}

export interface UseCustomCommandsReturn {
    clearEditorContent: () => void;
}

export interface LocalStoragePluginProps {
    namespace: string;
};