using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/deletesubtask")]
    [ApiController]
    public class DeleteSubTaskController : ControllerBase
    {
        [HttpDelete("{subtaskGUID}")]
        public async Task<ActionResult> Delete(string subtaskGUID)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            var subtask = await db.GoalSubTasks.FindAsync(Guid.Parse(subtaskGUID));

            if (subtask.StudentUID == uid)
            {
                db.GoalSubTasks.Remove(subtask);
                await db.SaveChangesAsync();

                return Ok();
            }
            else
            {
                return Forbid();
            }
        }
    }
}
