using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using core.Models;
using core.repositories;
using Microsoft.AspNetCore.Mvc;

namespace core.Controllers
{
    [Route("api/[controller]")]
    public class RecordsController : Controller
    {
        private IRecordsRepository _recordsRepository;
        public RecordsController(IRecordsRepository recordsRepository)
        {
            _recordsRepository = recordsRepository;
        }
            
            
        // GET api/values
        [HttpGet]
        public IEnumerable<Record> Get()
        {
            var userId = Authentificate.VerifyUser(this.Request.Cookies);
            if (userId != null)
            {
                return _recordsRepository.FindAllRecordsByUser(userId.Value);
            }
            return null;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
