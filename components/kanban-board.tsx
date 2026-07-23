'use client';

import { Board, Column, JobApplication } from '@/constants/types';
import {
  Award,
  Calendar,
  Check,
  Mic,
  MoreVertical,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CreateJobApplicationDialog from './create-job-dialog';
import CreateColumnDialog from './create-column-dialog';
import JobApplicationCard from './job-application-card';
import { useBoard } from '@/lib/hooks/useBoards';
import { renameColumn, deleteColumn } from '@/lib/actions/columns';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface KanbanBoardProps {
  board: Board;
}

interface ColConfig {
  color: string;
  icon: React.ReactNode;
}

const COLUMN_CONFIG: Array<ColConfig> = [
  { color: 'from-cyan-500 to-cyan-600', icon: <Calendar className="h-4 w-4" /> },
  { color: 'from-emerald-500 to-emerald-600', icon: <Mic className="h-4 w-4" /> },
  { color: 'from-amber-500 to-amber-600', icon: <Award className="h-4 w-4" /> },
  { color: 'from-rose-500 to-rose-600', icon: <XCircle className="h-4 w-4" /> },
];

function ColumnTitle({ column }: { column: Column }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(column.name);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!value.trim() || value === column.name) {
      setValue(column.name);
      setEditing(false);
      return;
    }
    setSaving(true);
    const result = await renameColumn(column.id, value);
    if (result.error) {
      setValue(column.name);
    }
    setSaving(false);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          autoFocus
          value={value}
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setValue(column.name);
              setEditing(false);
            }
          }}
          className="h-7 bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm font-semibold"
        />
        <button
          onClick={handleSave}
          className="text-white/90 hover:text-white shrink-0"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setValue(column.name);
            setEditing(false);
          }}
          className="text-white/90 hover:text-white shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <CardTitle
      onClick={() => setEditing(true)}
      className="text-white text-base font-semibold cursor-text hover:opacity-80 truncate"
    >
      {column.name}
    </CardTitle>
  );
}

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: {
  column: Column;
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  });

  const sortedJobs = [...column.jobApplications].sort(
    (a, b) => a.order - b.order
  );

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${column.name}" and all ${sortedJobs.length} job application(s) in it? This can't be undone.`
    );
    if (!confirmed) return;
    await deleteColumn(column.id);
  }

  return (
    <Card className="min-w-[300px] flex-shrink-0 shadow-md p-0 rounded-xl overflow-hidden border-none">
      <CardHeader className={`bg-gradient-to-r ${config.color} text-white pb-3 pt-3`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {config.icon}
            <ColumnTitle column={column} />
            <span className="text-xs font-medium bg-white/20 rounded-full px-2 py-0.5 shrink-0">
              {sortedJobs.length}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20 shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent
        ref={setNodeRef}
        className={`space-y-2 pt-4 bg-gray-50/70 min-h-[400px] transition-colors ${
          isOver ? 'ring-2 ring-inset ring-blue-400 bg-blue-50/50' : ''
        }`}
      >
        <SortableContext
          items={sortedJobs.map((job) => job.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedJobs.map((job) => (
            <SortableJobCard
              key={job.id}
              job={{ ...job, columnId: job.columnId || column.id }}
              columns={sortedColumns}
            />
          ))}
        </SortableContext>

        <CreateJobApplicationDialog columnId={column.id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}

function SortableJobCard({
  job,
  columns,
}: {
  job: JobApplication;
  columns: Column[];
}) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: job.id,
    data: { type: 'job', job },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function KanbanBoard({ board }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { columns, moveJob } = useBoard(board);

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !board.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns) {
      const jobs = [...column.jobApplications].sort(
        (a, b) => a.order - b.order
      );
      const jobIndex = jobs.findIndex((j) => j.id === activeId);
      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) return;

    const targetColumn = sortedColumns.find((col) => col.id === overId);
    const targetJob = sortedColumns
      .flatMap((col) => col.jobApplications || [])
      .find((job) => job.id === overId);

    let targetColumnId: string;
    let newOrder: number;

    if (targetColumn) {
      targetColumnId = targetColumn.id;
      const jobsInTarget = targetColumn.jobApplications
        .filter((j) => j.id !== activeId)
        .sort((a, b) => a.order - b.order);
      newOrder = jobsInTarget.length;
    } else if (targetJob) {
      const targetJobColumn = sortedColumns.find((col) =>
        col.jobApplications.some((j) => j.id === targetJob.id)
      );
      targetColumnId = targetJob.columnId || targetJobColumn?.id || '';
      if (!targetColumnId) return;

      const targetColumnObj = sortedColumns.find(
        (col) => col.id === targetColumnId
      );
      if (!targetColumnObj) return;

      const allJobsInTargetOriginal = [
        ...targetColumnObj.jobApplications,
      ].sort((a, b) => a.order - b.order);

      const allJobsInTargetFiltered = allJobsInTargetOriginal.filter(
        (j) => j.id !== activeId
      );

      const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
        (j) => j.id === overId
      );
      const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
        (j) => j.id === overId
      );

      if (targetIndexInFiltered !== -1) {
        if (sourceColumn.id === targetColumnId) {
          newOrder =
            sourceIndex < targetIndexInOriginal
              ? targetIndexInFiltered + 1
              : targetIndexInFiltered;
        } else {
          newOrder = targetIndexInFiltered;
        }
      } else {
        newOrder = allJobsInTargetFiltered.length;
      }
    } else {
      return;
    }

    if (!targetColumnId) return;

    await moveJob(activeId, targetColumnId, newOrder);
  }

  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-fit items-start">
          {sortedColumns.map((col, index) => {
            const config = COLUMN_CONFIG[index % COLUMN_CONFIG.length];
            return (
              <DroppableColumn
                key={col.id}
                column={col}
                config={config}
                boardId={board.id}
                sortedColumns={sortedColumns}
              />
            );
          })}
          <CreateColumnDialog boardId={board.id} />
        </div>
      </div>

      <DragOverlay>
        {activeJob ? (
          <div className="opacity-90 rotate-2 scale-105">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}