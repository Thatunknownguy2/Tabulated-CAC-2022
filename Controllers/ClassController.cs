using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/class")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        [HttpGet("{guid}")]
        public async Task<ActionResult> Get(string guid)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            
            try
            {
                var clas = await db.Classes.FindAsync(Guid.Parse(guid));

                if (clas.StudentUID == uid)
                {
                    return Ok(clas);
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception)
            {
                return BadRequest("Invalid GUID!");
            }
        }
    }
}
