using Microsoft.AspNetCore.Mvc;
using System.Dynamic;

namespace Tabulated.Controllers
{
    [Route("api/firebaseconfig")]
    [ApiController]
    public class FirebaseConfigController : ControllerBase
    {
        private IConfiguration configuration;

        public FirebaseConfigController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet]
        public ActionResult Get()
        {
            dynamic config = new ExpandoObject();
            config.apiKey = configuration["Firebase:apiKey"];
            config.authDomain = configuration["Firebase:authDomain"];
            config.projectId = configuration["Firebase:projectId"];
            config.storageBucket = configuration["Firebase:storageBucket"];
            config.messagingSenderId = configuration["Firebase:messagingSenderId"];
            config.appId = configuration["Firebase:appId"];

            return Ok(config);
        }
    }
}
