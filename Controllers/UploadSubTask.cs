using Tabulated.DBModels;
using Tabulated.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/uploadsubtask")]
    [ApiController]
    public class UploadSubTask : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Post(SubTaskBase subTaskBase)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            var goal = await db.ClassGoals.FindAsync(Guid.Parse(subTaskBase.GoalGUID));

            if (goal.StudentUID == uid)
            {
                var subtask = new SubTask { StudentUID = uid, GoalGUID = goal.Id, Name = subTaskBase.Name, IsCompleted = false };

                await db.GoalSubTasks.AddAsync(subtask);
                await db.SaveChangesAsync();

                return Ok(subtask);
            }
            else
            {
                return Forbid();
            }
        }
    }

    public class SubTaskBase
    {
        public string Name { get; set; }
        public string GoalGUID { get; set; }
    }
}
