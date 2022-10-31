using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/subtasks")]
    [ApiController]
    public class SubTasksController : ControllerBase
    {
        [HttpGet("{goalGUID}")]
        public async Task<ActionResult> Get(string goalGUID)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            var goal = await db.ClassGoals.FindAsync(Guid.Parse(goalGUID));
            
            if (goal.StudentUID == uid)
            {
                var subtasks = await db.GoalSubTasks.Where(task => task.GoalGUID == goal.Id).ToListAsync();
                return Ok(subtasks);
            }
            else
            {
                return Forbid();
            }
        }
    }
}
