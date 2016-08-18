namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class emailtoken : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "EmailToken", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "EmailToken");
        }
    }
}
