-- CreateIndex
CREATE INDEX `activities_type_idx` ON `activities`(`type`);

-- CreateIndex
CREATE INDEX `activities_createdAt_idx` ON `activities`(`createdAt`);

-- CreateIndex
CREATE INDEX `contacts_firstName_idx` ON `contacts`(`firstName`);

-- CreateIndex
CREATE INDEX `deals_title_idx` ON `deals`(`title`);

-- CreateIndex
CREATE INDEX `leads_title_idx` ON `leads`(`title`);

-- RenameIndex
ALTER TABLE `deals` RENAME INDEX `deals_assignedToId_fkey` TO `deals_assignedToId_idx`;

-- RenameIndex
ALTER TABLE `leads` RENAME INDEX `leads_assignedToId_fkey` TO `leads_assignedToId_idx`;
