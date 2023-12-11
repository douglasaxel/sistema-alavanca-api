-- AlterTable
ALTER TABLE `airtable_links` ADD COLUMN `iframe` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `projects` MODIFY `airtableIframeUrl` VARCHAR(255) NULL;
