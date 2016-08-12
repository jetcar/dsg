namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRecords : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Group",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Name = c.String(nullable: false, maxLength: 256),
                        Time = c.DateTime(nullable: false),
                        UserId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Record",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Name = c.String(nullable: false, maxLength: 256),
                        Time = c.DateTime(nullable: false),
                        GroupId = c.Int(),
                        UserId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .ForeignKey("dbo.Group", t => t.GroupId)
                .Index(t => t.GroupId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Sequence",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Name = c.String(nullable: false, maxLength: 256),
                        Time = c.DateTime(nullable: false),
                        UserId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Sequence", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Record", "GroupId", "dbo.Group");
            DropForeignKey("dbo.Record", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Group", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Sequence", new[] { "UserId" });
            DropIndex("dbo.Record", new[] { "UserId" });
            DropIndex("dbo.Record", new[] { "GroupId" });
            DropIndex("dbo.Group", new[] { "UserId" });
            DropTable("dbo.Sequence");
            DropTable("dbo.Record");
            DropTable("dbo.Group");
        }
    }
}
