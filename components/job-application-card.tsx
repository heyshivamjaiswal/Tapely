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

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
}

export default function JobApplicationCard({
  job,
  columns,
}: JobApplicationCardProps) {
  return (
    <>
      <Card className="cursor-pointer transition-shadow hover:shadow-lg bg-white group shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {job.company}
              </p>
              {job.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {job.description}
                </p>
              )}
              {job.tags && job.tags.length > 0 && (
                <div>
                  {job.tags.map((tag, key) => (
                    <span key={key}>{tag}</span>
                  ))}

                  {job.jobUrl && (
                    <a
                      target="_blank"
                      href={job.jobUrl}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink />
                    </a>
                  )}
                </div>
              )}
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon">
                      <MoreVertical />
                    </Button>
                  }
                />
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit2 />
                    Edit
                  </DropdownMenuItem>
                  {columns.length > 1 && (
                    <>
                      {columns
                        .filter((c) => c.id !== job.columnId)
                        .map((column, key) => (
                          <DropdownMenuItem key={key}>
                            Move to {column.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}
                  <DropdownMenuItem>
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
