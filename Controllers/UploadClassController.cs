using Tabulated.DBModels;
using Tabulated.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/uploadclass")]
    [ApiController]
    public class UploadClassController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Post(Class clas)
        {
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;

            if (clas.StudentUID == uid)
            {
                clas.ClassName = clas.ClassName.Trim();

                using var db = new ClassesDBContext();
                await db.Classes.AddAsync(clas);
                await db.SaveChangesAsync();

                return Ok();
            } else
            {
                return Forbid();
            }
        }
    }
}
