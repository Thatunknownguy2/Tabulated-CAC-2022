using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/classes")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;

            var classes = await db.Classes.Where(cl => cl.StudentUID == uid).ToListAsync();

            return Ok(classes);
        }
    }
}
