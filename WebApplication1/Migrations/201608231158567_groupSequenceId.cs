namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class groupSequenceId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Group", "SequenceId", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Group", "SequenceId");
        }
    }
}
