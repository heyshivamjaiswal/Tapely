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
            className="min-w-[280px] h-full min-h-[120px] flex-shrink-0 border-dashed border-2 text-muted-foreground hover:border-solid hover:bg-muted/50 flex flex-col items-center justify-center gap-2 rounded-xl"
          >
            <Plus className="h-5 w-5" />
            Add Column
          </Button>
        }
      />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Column</DialogTitle>
          <DialogDescription>
            Add a stage to your board — e.g. "Phone Screen" or "Final Round"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
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
      </DialogContent>
    </Dialog>
  );
}