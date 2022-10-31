using Tabulated.DBModels;
using Tabulated.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/updatesubtask")]
    [ApiController]
    public class UpdateSubtaskController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Post(SubTask subTask)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;

            if (subTask.StudentUID == uid)
            {
                var updatedSubTask = await db.GoalSubTasks.FindAsync(subTask.Id);
                updatedSubTask.IsCompleted = subTask.IsCompleted;

                await db.SaveChangesAsync();

                return Ok(subTask.IsCompleted);
            }
            else
            {
                return Forbid();
            }
        }
    }
}
