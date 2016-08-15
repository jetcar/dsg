using System;
using System.Collections.Generic;
using System.Linq;
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
    [Authorize]
    public class RecordsController : ApiController
    {
        private ApplicationUserManager _userManager;
        private ApplicationDbContext _applicationDbContext;

        public RecordsController()
        {
        }

        public RecordsController(ApplicationUserManager userManager, ApplicationDbContext applicationDbContext)
        {
            UserManager = userManager;
            _applicationDbContext = applicationDbContext;
        }

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
        public List<Record> Get()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());

            return ApplicationDbContext.Records.Where(x=>x.UserId == user.Id).ToList();
        }

        public Record Post(Record record)
        {
            if (ModelState.IsValid)
            {
                record.UserId = User.Identity.GetUserId();
                ApplicationDbContext.Records.Add(record);
                ApplicationDbContext.SaveChanges();
                return record;
            }
            return null;
        }

    }
    public class CustomAuthorizeAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            base.OnAuthorization(actionContext);
        }

        public override Task OnAuthorizationAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
        {
            return base.OnAuthorizationAsync(actionContext, cancellationToken);
        }
    }

}