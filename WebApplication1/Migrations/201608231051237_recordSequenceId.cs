namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class recordSequenceId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Record", "SequenceId", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Record", "SequenceId");
        }
    }
}
