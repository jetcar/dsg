namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveForeignKeys : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Group", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Record", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Record", "GroupId", "dbo.Group");
            DropForeignKey("dbo.Sequence", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Group", new[] { "UserId" });
            DropIndex("dbo.Record", new[] { "GroupId" });
            DropIndex("dbo.Record", new[] { "UserId" });
            DropIndex("dbo.Sequence", new[] { "UserId" });
            AlterColumn("dbo.Group", "UserId", c => c.String());
            AlterColumn("dbo.Record", "UserId", c => c.String());
            AlterColumn("dbo.Sequence", "UserId", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Sequence", "UserId", c => c.String(maxLength: 128));
            AlterColumn("dbo.Record", "UserId", c => c.String(maxLength: 128));
            AlterColumn("dbo.Group", "UserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Sequence", "UserId");
            CreateIndex("dbo.Record", "UserId");
            CreateIndex("dbo.Record", "GroupId");
            CreateIndex("dbo.Group", "UserId");
            AddForeignKey("dbo.Sequence", "UserId", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Record", "GroupId", "dbo.Group", "Id");
            AddForeignKey("dbo.Record", "UserId", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Group", "UserId", "dbo.AspNetUsers", "Id");
        }
    }
}
