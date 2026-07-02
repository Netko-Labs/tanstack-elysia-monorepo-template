CREATE TABLE "chat_message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author_id" text,
	"author_name" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;