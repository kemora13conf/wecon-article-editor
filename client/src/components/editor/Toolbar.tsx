import { Undo, Redo, Download, Upload, Eye, Edit3, Smartphone, Tablet, Monitor, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEditor } from '@/context/EditorContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

export const Toolbar = () => {
  const {
    mode,
    setMode,
    currentBreakpoint,
    setCurrentBreakpoint,
    articleTitle,
    setArticleTitle,
    undo,
    redo,
    canUndo,
    canRedo,
    exportToJSON,
    importFromJSON,
    clearAll,
  } = useEditor();
  const { toast } = useToast();

  const handleExport = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${articleTitle.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Article Exported',
      description: 'Your article has been downloaded as JSON',
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result as string;
            importFromJSON(json);
            toast({
              title: 'Article Imported',
              description: 'Your article has been successfully loaded',
            });
          } catch (error) {
            toast({
              title: 'Import Failed',
              description: 'Invalid JSON file',
              variant: 'destructive',
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const breakpointIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };

  return (
    <div className="h-14 border-b bg-card flex items-center px-4 gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-1">
        <h1 className="text-sm font-semibold text-foreground">Article Editor</h1>
        <Separator orientation="vertical" className="h-6" />
        <Input
          value={articleTitle}
          onChange={(e) => setArticleTitle(e.target.value)}
          className="max-w-xs text-sm h-8"
          placeholder="Article title..."
          data-testid="input-article-title"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-muted rounded-md p-1">
          <Button
            size="sm"
            variant={mode === 'edit' ? 'secondary' : 'ghost'}
            onClick={() => setMode('edit')}
            className="h-7 text-xs"
            data-testid="button-mode-edit"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant={mode === 'preview' ? 'secondary' : 'ghost'}
            onClick={() => setMode('preview')}
            className="h-7 text-xs"
            data-testid="button-mode-preview"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1 bg-muted rounded-md p-1">
          {(['mobile', 'tablet', 'desktop'] as const).map((bp) => {
            const Icon = breakpointIcons[bp];
            return (
              <Button
                key={bp}
                size="icon"
                variant={currentBreakpoint === bp ? 'secondary' : 'ghost'}
                onClick={() => setCurrentBreakpoint(bp)}
                className="h-7 w-7"
                data-testid={`button-breakpoint-${bp}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </Button>
            );
          })}
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={undo}
            disabled={!canUndo}
            className="h-8 w-8"
            data-testid="button-undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={redo}
            disabled={!canRedo}
            className="h-8 w-8"
            data-testid="button-redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleImport}
            className="h-8 text-xs"
            data-testid="button-import"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Import
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExport}
            className="h-8 text-xs"
            data-testid="button-export"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                data-testid="button-clear-all-trigger"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Blocks?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all blocks from your article. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-testid="button-confirm-clear"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
