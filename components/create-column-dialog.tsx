'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createColumn } from '@/lib/actions/columns';
import { COLUMN_HEIGHT, COLUMN_WIDTH } from './kanban-board';

export default function CreateColumnDialog({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const result = await createColumn(boardId, name);

    if (result.error) {
      setError(result.error);
    } else {
      setName('');
      setOpen(false);
    }

    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className={`${COLUMN_WIDTH} ${COLUMN_HEIGHT} flex-shrink-0 border-dashed border-2 text-muted-foreground hover:border-solid hover:bg-muted/50 hover:text-foreground flex flex-col items-center justify-center gap-2 rounded-xl transition-all`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <Plus className="h-4 w-4" />
            </span>
            Add Column
          </Button>
        }
      />
      <DialogContent className="max-w-sm overflow-hidden p-0">
        <div className="h-1.5 w-full bg-primary" />
        <div className="p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl">New Column</DialogTitle>
            <DialogDescription>
              Add a stage to your board — e.g. "Phone Screen" or "Final Round"
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="column-name">Column name</Label>
              <Input
                id="column-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Phone Screen"
                required
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Adding...' : 'Add Column'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}