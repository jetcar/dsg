using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public virtual DbSet<Record> Records { get; set; }
        public virtual DbSet<Group> Groups { get; set; }
        public virtual DbSet<Sequence> Sequences { get; set; }

    }
}