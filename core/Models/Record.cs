using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace core.Models
{
    public class Record
    {
        [Key]
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Name { get; set; }
        public DateTime Time { get; set; }
        public int Groupid { get; set; }
        public int Sequenceid { get; set; }
        public Guid UserId { get; set; }
        public bool Paid { get; set; }
    }
}
