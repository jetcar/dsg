using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using core.Models;
using Microsoft.EntityFrameworkCore;

namespace core.repositories
{
    public class DomainModelPostgreSqlContext : DbContext
    {

        public DbSet<Record> Records { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Record>().HasKey(m => m.Id);
           
            // shadow properties
            builder.Entity<Record>().Property<DateTime>("UpdatedTimestamp");

            base.OnModelCreating(builder);
        }

        public override int SaveChanges()
        {
            ChangeTracker.DetectChanges();

            updateUpdatedProperty<Record>();

            return base.SaveChanges();
        }

        private void updateUpdatedProperty<T>() where T : class
        {
            var modifiedSourceInfo =
                ChangeTracker.Entries<T>()
                    .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in modifiedSourceInfo)
            {
                entry.Property("UpdatedTimestamp").CurrentValue = DateTime.UtcNow;
            }
        }
    }
}
