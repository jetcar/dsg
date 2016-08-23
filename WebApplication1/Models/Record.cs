using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
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

        public bool Paid { get; set; }

        public int? SequenceId { get; set; }


    }
}