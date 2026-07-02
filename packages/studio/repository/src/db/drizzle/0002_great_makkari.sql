ALTER TABLE "todo" DROP CONSTRAINT "todo_created_by_user_id_fk";
--> statement-breakpoint
DROP INDEX "todo_createdBy_idx";--> statement-breakpoint
ALTER TABLE "todo" DROP COLUMN "created_by";