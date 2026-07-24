'use client';

import { Column, JobApplication } from '@/constants/types';
import { Card, CardContent } from './ui/card';
import { Edit2, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import {
  deleteJobApplication,
  updateJobApplication,
} from '@/lib/actions/job-applications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import React, { useState } from 'react';

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

// Purely presentational — cycles tags through the same tape palette used
// elsewhere in the app, deterministic by tag text so a given tag always gets
// the same color across cards.
const TAG_COLORS = [
  'bg-tape-cyan/10 text-tape-cyan',
  'bg-tape-violet/10 text-tape-violet',
  'bg-tape-amber/10 text-tape-amber',
  'bg-tape-emerald/10 text-tape-emerald',
  'bg-tape-rose/10 text-tape-rose',
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) % TAG_COLORS.length;
  }
  return TAG_COLORS[hash];
}

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || '',
    notes: job.notes || '',
    salary: job.salary || '',
    jobUrl: job.jobUrl || '',
    tags: job.tags?.join(', ') || '',
    description: job.description || '',
  });

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateJobApplication(job.id, {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if (!result.error) {
        setIsEditing(false);
      } else {
        console.error('Failed to update job application:', result.error);
      }
    } catch (err) {
      console.error('Failed to update job application:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      const result = await deleteJobApplication(job.id);
      if (result.error) {
        console.error('Failed to delete job application:', result.error);
      }
    } catch (err) {
      console.error('Failed to delete job application:', err);
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      const result = await updateJobApplication(job.id, {
        columnId: newColumnId,
      });
      if (result.error) {
        console.error('Failed to move job application:', result.error);
      }
    } catch (err) {
      console.error('Failed to move job application:', err);
    }
  }

  return (
    <>
      <Card
        className="group cursor-grab border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
        {...dragHandleProps}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="mb-0.5 truncate font-heading text-sm font-semibold">
                {job.position}
              </h3>
              <p className="mb-2 truncate text-xs text-muted-foreground">
                {job.company}
              </p>

              {job.description && (
                <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
                  {job.description}
                </p>
              )}

              {job.tags && job.tags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {job.jobUrl && (
                 <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  View posting
                </a>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-[popup-open]:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {columns.length > 1 &&
                  columns
                    .filter((c) => c.id !== job.columnId)
                    .map((column) => (
                      <DropdownMenuItem
                        key={column.id}
                        onClick={() => handleMove(column.id)}
                      >
                        Move to {column.name}
                      </DropdownMenuItem>
                    ))}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          <div className="h-1.5 w-full bg-primary" />
          <div className="max-h-[85vh] overflow-y-auto p-6">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl">
                Edit Job Application
              </DialogTitle>
              <DialogDescription>
                Update this application&apos;s details
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      required
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      placeholder="e.g., 12 LPA, 20 LPA"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobUrl">Job URL</Label>
                  <Input
                    id="jobUrl"
                    placeholder="https://.."
                    value={formData.jobUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, jobUrl: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="React, Nextjs, Backend"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}