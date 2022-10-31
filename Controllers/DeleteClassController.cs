using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/deleteclass")]
    [ApiController]
    public class DeleteClassController : ControllerBase
    {
        [HttpDelete("{classGUID}")]
        public async Task<IActionResult> Delete(string classGUID)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            var clas = await db.Classes.FindAsync(Guid.Parse(classGUID));

            if (clas.StudentUID == uid)
            {
                db.Assignments.Where(assign => assign.ClassGUID == clas.Id).ToList().ForEach(assign =>
                {
                    db.Assignments.Remove(assign);
                });

                db.ClassGoals.Where(goal => goal.ClassGUID == clas.Id).ToList().ForEach(goal =>
                {
                    db.GoalSubTasks.Where(subtask => subtask.GoalGUID == goal.Id).ToList().ForEach(subtask =>
                    {
                        db.GoalSubTasks.Remove(subtask);
                    });

                    db.ClassGoals.Remove(goal);
                });

                db.Classes.Remove(clas);
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
