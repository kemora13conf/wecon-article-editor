import { Type, AlignLeft, Image, Video, FileText, Code, Minus, List, ListOrdered, Quote, LayoutGrid, Columns } from 'lucide-react';
import type { BlockType, Block, BreakpointStyles, StyleObject } from '@shared/schema';

export interface BlockTypeInfo {
  type: BlockType;
  label: string;
  icon: any;
  category: 'text' | 'media' | 'code' | 'layout';
}

export const blockTypes: BlockTypeInfo[] = [
  // Text blocks
  { type: 'h1', label: 'Heading 1', icon: Type, category: 'text' },
  { type: 'h2', label: 'Heading 2', icon: Type, category: 'text' },
  { type: 'h3', label: 'Heading 3', icon: Type, category: 'text' },
  { type: 'h4', label: 'Heading 4', icon: Type, category: 'text' },
  { type: 'h5', label: 'Heading 5', icon: Type, category: 'text' },
  { type: 'h6', label: 'Heading 6', icon: Type, category: 'text' },
  { type: 'paragraph', label: 'Paragraph', icon: AlignLeft, category: 'text' },
  { type: 'caption', label: 'Caption', icon: AlignLeft, category: 'text' },
  { type: 'quote', label: 'Quote', icon: Quote, category: 'text' },
  { type: 'list', label: 'Bullet List', icon: List, category: 'text' },
  { type: 'numbered-list', label: 'Numbered List', icon: ListOrdered, category: 'text' },
  
  // Code blocks
  { type: 'code', label: 'Code Block', icon: Code, category: 'code' },
  
  // Layout blocks
  { type: 'divider', label: 'Divider', icon: Minus, category: 'layout' },
  { type: 'section', label: 'Section', icon: LayoutGrid, category: 'layout' },
  { type: 'flex', label: 'Flex Container', icon: Columns, category: 'layout' },
  
  // Media blocks
  { type: 'image', label: 'Image', icon: Image, category: 'media' },
  { type: 'video', label: 'Video', icon: Video, category: 'media' },
  { type: 'pdf', label: 'PDF', icon: FileText, category: 'media' },
  { type: 'file', label: 'File', icon: FileText, category: 'media' },
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
    fontFamily: 'Inter, sans-serif',
    fontSize: '1rem',
    fontWeight: '400',
    color: '#1f2937',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '0.5rem',
    marginLeft: '0',
    marginRight: '0',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    textAlign: 'left',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
    flexDirection: 'row',
    gap: '1rem',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    backgroundColor: 'transparent',
    borderRadius: '0',
    border: 'none',
  };

  const typeSpecificStyles: Record<string, Partial<StyleObject>> = {
    h1: { fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem' },
    h2: { fontSize: '2rem', fontWeight: '700', marginBottom: '1.25rem' },
    h3: { fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem' },
    h4: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' },
    h5: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' },
    h6: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' },
    paragraph: { fontSize: '1rem', lineHeight: '1.75', marginBottom: '1rem' },
    caption: { fontSize: '0.875rem', fontWeight: '400', color: '#6b7280', fontStyle: 'italic' },
    quote: {
      fontSize: '1.125rem',
      fontStyle: 'italic',
      paddingLeft: '1.5rem',
      borderLeft: '4px solid #667eea',
      color: '#4b5563',
      marginBottom: '1rem',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
    },
    list: {
      fontSize: '1rem',
      lineHeight: '1.75',
      marginBottom: '1rem',
      paddingLeft: '1.5rem',
    },
    'numbered-list': {
      fontSize: '1rem',
      lineHeight: '1.75',
      marginBottom: '1rem',
      paddingLeft: '1.5rem',
    },
    code: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.875rem',
      backgroundColor: '#1e293b',
      color: '#e2e8f0',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
    },
    divider: {
      height: '2px',
      backgroundColor: '#e5e7eb',
      border: 'none',
      marginTop: '2rem',
      marginBottom: '2rem',
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
    },
    image: { borderRadius: '0.5rem', marginBottom: '1rem', paddingTop: '0', paddingBottom: '0' },
    video: { borderRadius: '0.5rem', marginBottom: '1rem', paddingTop: '0', paddingBottom: '0' },
    flex: {
      display: 'flex',
      flexDirection: 'row',
      gap: '1rem',
      padding: '1.5rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      border: '2px dashed #e5e7eb',
    },
    section: {
      display: 'block',
      padding: '2rem',
      backgroundColor: '#fffbeb',
      borderRadius: '0.5rem',
      border: '2px solid #fbbf24',
      marginBottom: '1.5rem',
    },
  };

  return { ...baseStyles, ...(typeSpecificStyles[type] || {}) };
};

// Get default content for block type
export const getDefaultContent = (type: BlockType): string | string[] | { code: string; language: string } | null => {
  const isTextBlock = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'paragraph', 'caption', 'quote'].includes(type);

  if (type === 'code') {
    return { code: '// Write your code here', language: 'javascript' };
  }

  if (type === 'list') {
    return ['List item 1', 'List item 2', 'List item 3'];
  }

  if (type === 'numbered-list') {
    return ['First item', 'Second item', 'Third item'];
  }

  if (type === 'divider') {
    return null;
  }

  return isTextBlock ? '' : null;
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
