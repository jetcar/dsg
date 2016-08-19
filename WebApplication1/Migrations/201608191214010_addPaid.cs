namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addPaid : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Record", "Paid", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Record", "Paid");
        }
    }
}
