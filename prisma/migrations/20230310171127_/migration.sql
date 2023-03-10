/*
  Warnings:

  - The primary key for the `Email` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Email` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Email] DROP CONSTRAINT [Email_id_key];

-- AlterTable
ALTER TABLE [dbo].[Email] DROP CONSTRAINT [Email_pkey];
ALTER TABLE [dbo].[Email] DROP COLUMN [id];
ALTER TABLE [dbo].[Email] ADD CONSTRAINT Email_pkey PRIMARY KEY CLUSTERED ([Marea],[Serial]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
