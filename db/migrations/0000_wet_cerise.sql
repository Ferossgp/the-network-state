CREATE TABLE `owner` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`preferences` text DEFAULT ('{}')
);
