import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Block, Breakpoint } from '@shared/schema';
import { createNewBlock } from '@/lib/blocks';
import { useToast } from '@/hooks/use-toast';

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  currentBreakpoint: Breakpoint;
  mode: 'edit' | 'preview';
  articleTitle: string;
  history: Block[][];
  historyIndex: number;
}

interface EditorContextType extends EditorState {
  setBlocks: (blocks: Block[]) => void;
  addBlock: (block: Block, index?: number) => void;
  addBlockToContainer: (parentId: string, block: Block) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  selectBlock: (blockId: string | null) => void;
  setCurrentBreakpoint: (breakpoint: Breakpoint) => void;
  setMode: (mode: 'edit' | 'preview') => void;
  setArticleTitle: (title: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
  clearAll: () => void;
  saveArticle: () => void;
  loadArticle: (id: number) => void;
  createNewArticle: () => void;
  currentArticleId: number | null;
  isSaving: boolean;
  isLoading: boolean;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [state, setState] = useState<EditorState>({
    blocks: [],
    selectedBlockId: null,
    currentBreakpoint: 'desktop',
    mode: 'edit',
    articleTitle: 'Untitled Article',
    history: [[]],
    historyIndex: 0,
  });

  const [currentArticleId, setCurrentArticleId] = useState<number | null>(null);
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const article = {
        title: state.articleTitle,
        blocks: state.blocks,
      };

      if (currentArticleId) {
        return await apiRequest(`/api/articles/${currentArticleId}`, {
          method: 'PATCH',
          body: JSON.stringify(article),
        });
      } else {
        return await apiRequest('/api/articles', {
          method: 'POST',
          body: JSON.stringify(article),
        });
      }
    },
    onSuccess: (data) => {
      if (!currentArticleId && data.id) {
        setCurrentArticleId(data.id);
      }
      toast({
        title: 'Saved',
        description: 'Article saved successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive',
      });
    },
  });

  const addToHistory = useCallback((blocks: Block[]) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(blocks)));
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const setBlocks = useCallback((blocks: Block[]) => {
    setState(prev => ({ ...prev, blocks }));
    addToHistory(blocks);
  }, [addToHistory]);

  const addBlock = useCallback((block: Block, index?: number) => {
    setState(prev => {
      const newBlocks = [...prev.blocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, block);
      } else {
        newBlocks.push(block);
      }
      addToHistory(newBlocks);
      return { ...prev, blocks: newBlocks, selectedBlockId: block.id };
    });
  }, [addToHistory]);

  const addBlockToContainer = useCallback((parentId: string, block: Block) => {
    setState(prev => {
      const addToParentRecursive = (blocks: Block[]): Block[] => {
        return blocks.map(b => {
          if (b.id === parentId) {
            return {
              ...b,
              children: [...(b.children || []), block],
            };
          }
          if (b.children) {
            return { ...b, children: addToParentRecursive(b.children) };
          }
          return b;
        });
      };

      const newBlocks = addToParentRecursive(prev.blocks);
      addToHistory(newBlocks);
      return { ...prev, blocks: newBlocks, selectedBlockId: block.id };
    });
  }, [addToHistory]);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setState(prev => {
      const updateBlockRecursive = (blocks: Block[]): Block[] => {
        return blocks.map(block => {
          if (block.id === blockId) {
            return { ...block, ...updates };
          }
          if (block.children) {
            return { ...block, children: updateBlockRecursive(block.children) };
          }
          return block;
        });
      };

      const newBlocks = updateBlockRecursive(prev.blocks);
      addToHistory(newBlocks);
      return { ...prev, blocks: newBlocks };
    });
  }, [addToHistory]);

  const deleteBlock = useCallback((blockId: string) => {
    setState(prev => {
      const deleteBlockRecursive = (blocks: Block[]): Block[] => {
        return blocks.filter(block => {
          if (block.id === blockId) return false;
          if (block.children) {
            block.children = deleteBlockRecursive(block.children);
          }
          return true;
        });
      };

      const newBlocks = deleteBlockRecursive(prev.blocks);
      addToHistory(newBlocks);
      return {
        ...prev,
        blocks: newBlocks,
        selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
      };
    });
  }, [addToHistory]);

  const duplicateBlock = useCallback((blockId: string) => {
    setState(prev => {
      const findAndDuplicate = (blocks: Block[]): { blocks: Block[]; duplicated: boolean } => {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].id === blockId) {
            const duplicate = JSON.parse(JSON.stringify(blocks[i]));
            duplicate.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            const newBlocks = [...blocks];
            newBlocks.splice(i + 1, 0, duplicate);
            return { blocks: newBlocks, duplicated: true };
          }
          
          if (blocks[i].children) {
            const result = findAndDuplicate(blocks[i].children!);
            if (result.duplicated) {
              const newBlocks = [...blocks];
              newBlocks[i] = { ...newBlocks[i], children: result.blocks };
              return { blocks: newBlocks, duplicated: true };
            }
          }
        }
        return { blocks, duplicated: false };
      };

      const { blocks: newBlocks } = findAndDuplicate(prev.blocks);
      addToHistory(newBlocks);
      return { ...prev, blocks: newBlocks };
    });
  }, [addToHistory]);

  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    setState(prev => {
      const moveBlockRecursive = (blocks: Block[]): Block[] => {
        const index = blocks.findIndex(b => b.id === blockId);
        if (index === -1) {
          return blocks.map(block => ({
            ...block,
            children: block.children ? moveBlockRecursive(block.children) : undefined,
          }));
        }

        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newBlocks.length) {
          [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        }

        return newBlocks;
      };

      const newBlocks = moveBlockRecursive(prev.blocks);
      addToHistory(newBlocks);
      return { ...prev, blocks: newBlocks };
    });
  }, [addToHistory]);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    setState(prev => {
      const newBlocks = Array.from(prev.blocks);
      const [removed] = newBlocks.splice(startIndex, 1);
      newBlocks.splice(endIndex, 0, removed);
      addToHistory(newBlocks);
      return { ...prev, blocks: newBlocks };
    });
  }, [addToHistory]);

  const selectBlock = useCallback((blockId: string | null) => {
    setState(prev => ({ ...prev, selectedBlockId: blockId }));
  }, []);

  const setCurrentBreakpoint = useCallback((breakpoint: Breakpoint) => {
    setState(prev => ({ ...prev, currentBreakpoint: breakpoint }));
  }, []);

  const setMode = useCallback((mode: 'edit' | 'preview') => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setArticleTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, articleTitle: title }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          blocks: JSON.parse(JSON.stringify(prev.history[newIndex])),
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          blocks: JSON.parse(JSON.stringify(prev.history[newIndex])),
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const exportToJSON = useCallback(() => {
    const article = {
      title: state.articleTitle,
      blocks: state.blocks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return JSON.stringify(article, null, 2);
  }, [state.articleTitle, state.blocks]);

  const importFromJSON = useCallback((json: string) => {
    try {
      const article = JSON.parse(json);
      setState(prev => ({
        ...prev,
        blocks: article.blocks || [],
        articleTitle: article.title || 'Untitled Article',
      }));
      addToHistory(article.blocks || []);
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  }, [addToHistory]);

  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      blocks: [],
      selectedBlockId: null,
    }));
    addToHistory([]);
  }, [addToHistory]);

  const saveArticle = useCallback(() => {
    saveMutation.mutate();
  }, [saveMutation]);

  const loadArticle = useCallback(async (id: number) => {
    try {
      const article = await apiRequest(`/api/articles/${id}`);
      setState(prev => ({
        ...prev,
        blocks: article.blocks || [],
        articleTitle: article.title || 'Untitled Article',
      }));
      setCurrentArticleId(id);
      addToHistory(article.blocks || []);
      toast({
        title: 'Loaded',
        description: 'Article loaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load article',
        variant: 'destructive',
      });
    }
  }, [addToHistory, toast]);

  const createNewArticle = useCallback(() => {
    setState(prev => ({
      ...prev,
      blocks: [],
      selectedBlockId: null,
      articleTitle: 'Untitled Article',
      history: [[]],
      historyIndex: 0,
    }));
    setCurrentArticleId(null);
  }, []);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (state.blocks.length > 0) {
        saveMutation.mutate();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [state.blocks, currentArticleId, saveMutation]);

  const value: EditorContextType = {
    ...state,
    setBlocks,
    addBlock,
    addBlockToContainer,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    reorderBlocks,
    selectBlock,
    setCurrentBreakpoint,
    setMode,
    setArticleTitle,
    undo,
    redo,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    exportToJSON,
    importFromJSON,
    clearAll,
    saveArticle,
    loadArticle,
    createNewArticle,
    currentArticleId,
    isSaving: saveMutation.isPending,
    isLoading: false,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
