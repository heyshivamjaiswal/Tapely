'use client';

import { useEffect, useState } from 'react';
import { Board, Column, JobApplication } from '@/constants/types';
import { updateJobApplication } from '@/lib/actions/job-applications';

export function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(
    initialBoard?.columns || []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBoard) {
      setBoard(initialBoard);
      setColumns(initialBoard.columns || []);
    }
  }, [initialBoard]);

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number
  ) {
    // optimistic update — reorder client state immediately, before the server responds
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        jobApplications: [...col.jobApplications],
      }));

      let jobToMove: JobApplication | null = null;
      let oldColumnId: string | null = null;

      for (const col of newColumns) {
        const jobIndex = col.jobApplications.findIndex(
          (j) => j.id === jobApplicationId
        );
        if (jobIndex !== -1) {
          jobToMove = col.jobApplications[jobIndex];
          oldColumnId = col.id;
          col.jobApplications = col.jobApplications.filter(
            (job) => job.id !== jobApplicationId
          );
          break;
        }
      }

      if (jobToMove && oldColumnId) {
        const targetColumnIndex = newColumns.findIndex(
          (col) => col.id === newColumnId
        );

        if (targetColumnIndex !== -1) {
          const targetColumn = newColumns[targetColumnIndex];
          const updatedJobs = [...targetColumn.jobApplications];
          updatedJobs.splice(newOrder, 0, {
            ...jobToMove,
            columnId: newColumnId,
            order: newOrder * 100,
          });

          const jobsWithUpdatedOrders = updatedJobs.map((job, idx) => ({
            ...job,
            order: idx * 100,
          }));

          newColumns[targetColumnIndex] = {
            ...targetColumn,
            jobApplications: jobsWithUpdatedOrders,
          };
        }
      }

      return newColumns;
    });

    try {
      const result = await updateJobApplication(jobApplicationId, {
        columnId: newColumnId,
        order: newOrder,
      });

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Failed to move job application:', err);
      setError('Failed to move job application');
    }
  }

  return { board, columns, error, moveJob };
}