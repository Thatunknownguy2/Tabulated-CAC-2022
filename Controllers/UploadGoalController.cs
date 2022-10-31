using Tabulated.DBModels;
using Tabulated.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/uploadgoal")]
    [ApiController]
    public class UploadGoalController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Post(GoalBase goalBase)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            var clas = await db.Classes.FindAsync(Guid.Parse(goalBase.ClassGUID));

            if (clas.StudentUID == uid)
            {
                var newGoal = new Goal { ClassGUID = clas.Id, StudentUID = uid, Name = goalBase.Name };
                
                await db.ClassGoals.AddAsync(newGoal);
                await db.SaveChangesAsync();

                return Ok(newGoal);
            }
            else
            {
                return Forbid();
            }
        }
    }

    public class GoalBase
    {
        public string ClassGUID { get; set; }
        public string Name { get; set; }
    }
}
