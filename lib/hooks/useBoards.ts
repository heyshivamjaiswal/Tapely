"use client";

import { Board, Column } from "@/constants/types";
import { useState } from "react";


export function useBoard(initialBoard?: Board | null){
    const [board , setBoard] = useState<Board | null>(initialBoard|| null);
    const [columns , setColumns] = useState<Column[]>(initialBoard?.columns || []);
    const [error , setError] = useState<string | null>(null);
    
    async function moveJob(jobApplicationdId: string, newColumnId: string, newOrder: number){}
    return {board , columns, error , moveJob}
}

