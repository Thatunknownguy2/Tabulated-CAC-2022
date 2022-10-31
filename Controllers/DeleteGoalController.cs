using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/deletegoal")]
    [ApiController]
    public class DeleteGoalController : ControllerBase
    {
        [HttpDelete("{goalGUID}")]
        public async Task<ActionResult> Delete(string goalGUID)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            var goal = await db.ClassGoals.FindAsync(Guid.Parse(goalGUID));

            if (goal.StudentUID == uid)
            {
                db.GoalSubTasks.Where(subtask => subtask.GoalGUID == goal.Id).ToList().ForEach(subtask =>
                {
                    db.GoalSubTasks.Remove(subtask);
                });

                db.ClassGoals.Remove(goal);

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
