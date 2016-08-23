namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class sequenceCanBeGroup : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Sequence", "group", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Sequence", "group");
        }
    }
}
