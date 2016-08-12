using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity.Owin;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    public class LoginController : ApiController
    {
        private ApplicationDbContext _applicationDbContext;
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public LoginController()
        {
        }

        public LoginController(ApplicationUserManager userManager, ApplicationSignInManager signInManager, ApplicationDbContext applicationDbContext)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            _applicationDbContext = applicationDbContext;

        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
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

        public async Task<HttpResponseMessage> Get(string userid, string code)
        {
            var user = await UserManager.FindByIdAsync(userid);
            if (user.Token == code)
            {
                user.Token = null;
                ApplicationDbContext.SaveChanges();

                SignInManager.SignIn(user, true, true);
            }
            var response = Request.CreateResponse(HttpStatusCode.Moved);
            response.Headers.Location = new Uri(Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.PathAndQuery, ""));
            return response;
        }


        public async Task<string> Post(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    var result = await UserManager.CreateAsync(new ApplicationUser() { Email = model.Email, UserName = model.Email });
                    if (!result.Succeeded)
                        return "fail";
                    user = await UserManager.FindByEmailAsync(model.Email);

                }
                string code = Guid.NewGuid().ToString();
                user.Token = code;
                ApplicationDbContext.SaveChanges();

                var callbackUrl = Request.RequestUri.OriginalString + String.Format("?userid={0}&code={1}", user.Id, code);
                await
                    UserManager.SendEmailAsync(user.Id, "Confirm your account",
                        "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                return "ok";
            }
            return "fail";
        }
    }
}