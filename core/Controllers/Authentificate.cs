using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace core.Controllers
{
    public class Authentificate
    {
        public static Guid? VerifyUser(IRequestCookieCollection cookies)
        {
           return new Guid("f6001b6c - a788 - 5d1f - b1a2 - c42191496897");
        }
    }
}
