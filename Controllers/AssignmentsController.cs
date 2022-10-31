using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/assignments")]
    [ApiController]
    public class AssignmentsController : ControllerBase
    {
        [HttpGet("{classGUID}")]
        public async Task<ActionResult> Get(string classGUID)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;

            var assignments = await db.Assignments.Where(assign => assign.ClassGUID == Guid.Parse(classGUID) && assign.StudentUID == uid).ToListAsync();
            return Ok(assignments);
        }
    }
}
