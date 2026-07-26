'use client';

import { Plus, Sparkles } from 'lucide-react';
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
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { createJobApplication } from '@/lib/actions/job-applications';

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

const INITIAL_FORM_DATA = {
  company: '',
  position: '',
  location: '',
  notes: '',
  salary: '',
  jobUrl: '',
  tags: '',
  description: '',
};

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleAutoFill() {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiError('');

    try {
      const res = await fetch('/api/parse-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: aiInput }),
      });
      const result = await res.json();

      if (!res.ok) {
        setAiError(result.error || 'Failed to parse job details');
        return;
      }

      const { company, position, location, salary, tags, description, jobUrl } =
        result.data;

      setFormData((prev) => ({
        ...prev,
        company: company || prev.company,
        position: position || prev.position,
        location: location || prev.location,
        salary: salary || prev.salary,
        jobUrl: jobUrl || prev.jobUrl,
        tags: Array.isArray(tags) ? tags.join(', ') : prev.tags,
        description: description || prev.description,
      }));
    } catch (err) {
      console.error(err);
      setAiError('Something went wrong — try again');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const result = await createJobApplication({
        ...formData,
        columnId,
        boardId,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if (!result.error) {
        setFormData(INITIAL_FORM_DATA);
        setAiInput('');
        setOpen(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        }
      />
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <div className="h-1.5 w-full bg-primary" />
        <div className="max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl">Add Job Application</DialogTitle>
            <DialogDescription>Track a new job application</DialogDescription>
          </DialogHeader>

   <div className="space-y-2 rounded-lg border border-dashed p-3 bg-muted/30">
        <Label htmlFor="ai-input" className="text-sm font-medium">
           Auto-fill with AI
        </Label>
     <Textarea
       id="ai-input"
       rows={2}
       placeholder="Paste a job posting URL or the full job description..."
       value={aiInput}
       onChange={(e) => setAiInput(e.target.value)}
     />
       {aiError && <p className="text-xs text-destructive">{aiError}</p>}
     <Button
      type="button"
      size="sm"
      onClick={handleAutoFill}
      disabled={aiLoading || !aiInput.trim()}
      className="gap-1.5"
     >
    <Sparkles className="h-3.5 w-3.5" />
    {aiLoading ? 'Reading...' : 'Auto-fill with AI'}
     </Button>
  </div>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
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
                  placeholder="Brief description of the role.."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Application'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}