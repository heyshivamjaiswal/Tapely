ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_board_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "job_applications" DROP COLUMN "board_id";