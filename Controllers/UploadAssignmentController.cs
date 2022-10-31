using Tabulated.DBModels;
using Tabulated.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/uploadassignment")]
    [ApiController]
    public class UploadAssignmentController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Post(AssignmentBase assignmentBase)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            var clas = await db.Classes.FindAsync(Guid.Parse(assignmentBase.ClassGUID));

            if (clas.StudentUID == uid)
            {
                var newAssign = new Assignment { StudentUID = uid, ClassGUID = clas.Id, Name = assignmentBase.Name, Description = assignmentBase.Description, DueDate = assignmentBase.DueDate };

                await db.Assignments.AddAsync(newAssign);  
                await db.SaveChangesAsync();

                return Ok(newAssign);
            }
            else
            {
                return Forbid();
            }
        }
    }

    public class AssignmentBase
    {
        public string ClassGUID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DueDate { get; set; }
    }
}
