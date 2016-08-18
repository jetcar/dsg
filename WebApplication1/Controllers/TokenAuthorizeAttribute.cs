using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace WebApplication1.Controllers
{

    public class TokenAuthorizeAttribute : AuthorizationFilterAttribute
    {
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
        public override void OnAuthorization(HttpActionContext actionContext)
        {

            var identity = FetchAuthHeader(actionContext);
            if (identity == null)
            {
                ChallengeAuthRequest(actionContext);
                return;
            }
            var user = UserManager.FindById(identity.UserId);
            if (user == null)
            {
                ChallengeAuthRequest(actionContext);
                return;
            }
            if (user.Token != identity.Token)
            {
                ChallengeAuthRequest(actionContext);
                return;
            }
            Thread.CurrentPrincipal.SetUserId(user.Id);


            base.OnAuthorization(actionContext);
        }

        protected virtual Identity FetchAuthHeader(HttpActionContext filterContext)
        {
            Identity authHeaderValue = null;
            var cookies = filterContext.Request.Headers.GetCookies();
            foreach (var cookieHeaderValue in cookies)
            {
                foreach (var cookie in cookieHeaderValue.Cookies)
                {
                    if (cookie.Name == "token")
                    {
                        authHeaderValue = new Identity() { Token = cookie.Value.Split('|')[0], UserId = cookie.Value.Split('|')[1], };
                    }
                }
            }
            return authHeaderValue;
        }

        private static void ChallengeAuthRequest(HttpActionContext filterContext)
        {
            //var dnsHost = filterContext.Request.RequestUri.DnsSafeHost;
            filterContext.Response = filterContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
            //filterContext.Response.Headers.Add("WWW-Authenticate", string.Format("Basic realm=\"{0}\"", dnsHost));
        }
    }

    public class Identity
    {
        public string UserId { get; set; }
        public string Token { get; set; }
    }

    public static class GenericPrincipalExtensions
    {
        public static string GetUserId(this IPrincipal user)
        {
            ClaimsIdentity claimsIdentity = user.Identity as ClaimsIdentity;
            foreach (var claim in claimsIdentity.Claims)
            {
                if (claim.Type == ConfigurationConstants.Token)
                    return claim.Value;
            }
            return null;
        }

        public static void SetUserId(this IPrincipal user, string userid)
        {
            ClaimsIdentity claimsIdentity = user.Identity as ClaimsIdentity;
            foreach (var claim in claimsIdentity.Claims)
            {
                if (claim.Type == ConfigurationConstants.Token)
                {
                    claimsIdentity.RemoveClaim(claim);
                    break;
                }
            }
            claimsIdentity.AddClaim(new Claim(ConfigurationConstants.Token, userid));
        }


    }

    public class ConfigurationConstants
    {
        public static string Token = "UserId";
    }
}