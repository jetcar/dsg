using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace WebApplication1.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(256)]
        public string Token { get; set; }
        [MaxLength(256)]
        public string EmailToken { get; set; }

        [MaxLength(256)]
        public override string Id { get; set; }

        [MaxLength(256)]
        public override string Email { get; set; }

        public override bool EmailConfirmed { get; set; }

        [MaxLength(1256)]
        public override string PasswordHash { get; set; }

        [MaxLength(1256)]
        public override string PhoneNumber { get; set; }

        [MaxLength(256)]
        public override string UserName { get; set; }

        [MaxLength(1256)]
        public override string SecurityStamp { get; set; }



        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }

    [Table("Record")]
    public class Record
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(256)]
        public string Name { get; set; }
        [Required]
        public DateTime Time { get; set; }

        public int? GroupId { get; set; }

        [Required]
        [MaxLength(256)]
        public string UserId { get; set; }



    }

    [Table("Group")]
    public class Group
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(256)]
        public string Name { get; set; }
        [Required]
        public DateTime Time { get; set; }

        [Required]
        [MaxLength(256)]
        public string UserId { get; set; }


    }

    [Table("Sequence")]
    public class Sequence
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(256)]
        public string Name { get; set; }
        [Required]
        public DateTime Time { get; set; }

        [Required]
        public string UserId { get; set; }


    }
}