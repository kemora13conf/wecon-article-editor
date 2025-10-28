import { LayoutGrid, Columns } from 'lucide-react';
import type { BlockType, Block, BreakpointStyles, StyleObject } from '@shared/schema';

export interface BlockTypeInfo {
  type: BlockType;
  label: string;
  icon: any;
  category: 'text' | 'media' | 'code' | 'layout';
}

export const blockTypes: BlockTypeInfo[] = [
  // Layout blocks only
  { type: 'section', label: 'Section', icon: LayoutGrid, category: 'layout' },
  { type: 'flex', label: 'Flex Container', icon: Columns, category: 'layout' },
];

export const getBlockTypeInfo = (type: BlockType): BlockTypeInfo => {
  return blockTypes.find(bt => bt.type === type) || blockTypes[0];
};

export const blockTypesByCategory = blockTypes.reduce((acc, block) => {
  if (!acc[block.category]) {
    acc[block.category] = [];
  }
  acc[block.category].push(block);
  return acc;
}, {} as Record<string, BlockTypeInfo[]>);

export const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
];

// Default styles for each block type
export const getDefaultStyles = (type: BlockType): StyleObject => {
  const baseStyles: StyleObject = {
    width: 'auto',
    maxWidth: '100%',
    minWidth: '0',
    height: 'auto',
    maxHeight: 'none',
    minHeight: '0',
    marginTop: '0',
    marginBottom: '1rem',
    marginLeft: '0',
    marginRight: '0',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    backgroundColor: 'transparent',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  };

  const typeSpecificStyles: Record<string, Partial<StyleObject>> = {
    flex: {
      display: 'flex',
      flexDirection: 'row',
      gap: '1rem',
      padding: '1.5rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      border: '2px dashed #d1d5db',
      minHeight: '120px',
    },
    section: {
      display: 'block',
      padding: '2rem',
      backgroundColor: '#fefce8',
      borderRadius: '0.5rem',
      border: '2px solid #fde047',
      marginBottom: '1.5rem',
      minHeight: '120px',
    },
  };

  return { ...baseStyles, ...(typeSpecificStyles[type] || {}) };
};

// Get default content for block type
export const getDefaultContent = (type: BlockType): string | string[] | { code: string; language: string } | null => {
  // Layout blocks don't have content, only children
  return null;
};

// Create a new block
export const createNewBlock = (type: BlockType): Block => {
  const defaultStyles = getDefaultStyles(type);
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content: getDefaultContent(type),
    styles: {
      desktop: defaultStyles,
    },
    children: ['flex', 'section'].includes(type) ? [] : undefined,
  };
};

// Apply styles to an element
export const applyStylesToElement = (element: HTMLElement, styles: StyleObject) => {
  Object.entries(styles).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    element.style.setProperty(cssKey, String(value));
  });
};
