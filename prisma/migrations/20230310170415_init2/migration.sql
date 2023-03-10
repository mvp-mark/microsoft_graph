/*
  Warnings:

  - The primary key for the `Email` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[Email] DROP CONSTRAINT [Email_Marea_key];
ALTER TABLE [dbo].[Email] DROP CONSTRAINT [Email_Serial_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Email'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Email] (
    [id] NVARCHAR(1000) NOT NULL,
    [Marea] NVARCHAR(1000) NOT NULL,
    [Serial] NVARCHAR(1000) NOT NULL,
    [Result] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Email_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Email_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Email_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Email_Marea_key] UNIQUE NONCLUSTERED ([Marea]),
    CONSTRAINT [Email_Serial_key] UNIQUE NONCLUSTERED ([Serial])
);
IF EXISTS(SELECT * FROM [dbo].[Email])
    EXEC('INSERT INTO [dbo].[_prisma_new_Email] ([Marea],[Result],[Serial],[createdAt],[id],[updatedAt]) SELECT [Marea],[Result],[Serial],[createdAt],[id],[updatedAt] FROM [dbo].[Email] WITH (holdlock tablockx)');
DROP TABLE [dbo].[Email];
EXEC SP_RENAME N'dbo._prisma_new_Email', N'Email';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
