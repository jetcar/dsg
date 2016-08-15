namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class userid_required : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Group", "UserId", c => c.String(nullable: false));
            AlterColumn("dbo.Record", "UserId", c => c.String(nullable: false));
            AlterColumn("dbo.Sequence", "UserId", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Sequence", "UserId", c => c.String());
            AlterColumn("dbo.Record", "UserId", c => c.String());
            AlterColumn("dbo.Group", "UserId", c => c.String());
        }
    }
}
