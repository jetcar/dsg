using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using WebApplication1.Models;
using WebApplication1.Repositories;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using WebApplication1.Providers;

namespace WebApplication1.Controllers
{
    public class LoginController : ApiController
    {
        private ApplicationDbContext _applicationDbContext;
        private ApplicationUserManager _userManager;

        public LoginController()
        {
        }

        public LoginController(ApplicationUserManager userManager, ApplicationDbContext applicationDbContext)
        {
            UserManager = userManager;
            _applicationDbContext = applicationDbContext;

        }

        public ApplicationDbContext ApplicationDbContext
        {
            get
            {
                return _applicationDbContext ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationDbContext>();
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
                string token = Guid.NewGuid().ToString();
                user.EmailToken = token;
                ApplicationDbContext.SaveChanges();
                var action = RedirectToRoute("account/login", new { userid = user.Id, code = token });
                var callbackUrl = action.Request.RequestUri.ToString().Replace(action.Request.RequestUri.PathAndQuery,"") + $"/account/login?userid={user.Id}&code={token}";
                await
                    UserManager.SendEmailAsync(user.Id, "Confirm your account",
                        "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                return "ok";
            }
            return "fail";
        }


    }

}