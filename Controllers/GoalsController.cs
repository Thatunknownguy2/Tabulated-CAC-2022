using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/goals")]
    [ApiController]
    public class GoalsController : ControllerBase
    {
        [HttpGet("{classGUID}")]
        public async Task<ActionResult> Get(string classGUID)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;

            var goals = await db.ClassGoals.Where(goal => goal.ClassGUID == Guid.Parse(classGUID) && goal.StudentUID == uid).ToListAsync();
            return Ok(goals);
        }
    }
}
