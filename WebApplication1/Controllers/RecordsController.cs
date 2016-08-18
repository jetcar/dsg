using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [TokenAuthorize]
    public class RecordsController : ApiController
    {
        private ApplicationDbContext _applicationDbContext;

        public RecordsController()
        {
        }

        public RecordsController(ApplicationUserManager userManager, ApplicationDbContext applicationDbContext)
        {
            UserManager = userManager;
            _applicationDbContext = applicationDbContext;
        }

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        public ApplicationDbContext ApplicationDbContext
        {
            get
            {
                return _applicationDbContext ?? HttpContext.Current.GetOwinContext().Get<ApplicationDbContext>();
            }
            private set
            {
                _applicationDbContext = value;
            }
        }
        // GET api/Me
        [Route("api/records")]
        [HttpGet]
        public List<Record> GetRecords()
        {
            var user = UserManager.FindById(User.GetUserId());

            return ApplicationDbContext.Records.Where(x => x.UserId == user.Id).ToList();
        }
        [Route("api/groups")]
        [HttpGet]
        public List<Group> GetGroups()
        {
            var user = UserManager.FindById(User.GetUserId());

            return ApplicationDbContext.Groups.Where(x => x.UserId == user.Id).ToList();
        }
        [Route("api/sequences")]
        [HttpGet]
        public List<Sequence> GetSequences()
        {
            var user = UserManager.FindById(User.GetUserId());

            return ApplicationDbContext.Sequences.Where(x => x.UserId == user.Id).ToList();
        }

        [Route("api/records")]
        public Record Post(Record record)
        {
            if (ModelState.IsValid)
            {
                record.UserId = User.GetUserId();
                ApplicationDbContext.Records.Add(record);
                ApplicationDbContext.SaveChanges();
                return record;
            }
            throw new ModelValidationException(ModelState.Values.First().Errors.First().ErrorMessage);
        }
        [Route("api/groups")]
        public Group Post(Group record)
        {
            if (ModelState.IsValid)
            {
                record.UserId = User.GetUserId();
                ApplicationDbContext.Groups.Add(record);
                ApplicationDbContext.SaveChanges();
                return record;
            }
            throw new ModelValidationException(ModelState.Values.First().Errors.First().ErrorMessage);
        }

        [Route("api/sequences")]
        public Sequence Post(Sequence record)
        {
            if (ModelState.IsValid)
            {
                record.UserId = User.GetUserId();
                ApplicationDbContext.Sequences.Add(record);
                ApplicationDbContext.SaveChanges();
                return record;
            }
            throw new ModelValidationException(ModelState.Values.First().Errors.First().ErrorMessage);
        }

    }
    
}