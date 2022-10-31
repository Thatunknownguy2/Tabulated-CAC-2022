using Tabulated.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Tabulated.Controllers
{
    [Authorize]
    [Route("api/deleteassignment")]
    [ApiController]
    public class DeleteAssignmentController : ControllerBase
    {
        [HttpDelete("{assignGUID}")]
        public async Task<ActionResult> Delete(string assignGUID)
        {
            using var db = new ClassesDBContext();
            var uid = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            var assignment = await db.Assignments.FindAsync(Guid.Parse(assignGUID));

            if (assignment.StudentUID == uid)
            {
                db.Assignments.Remove(assignment);
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
