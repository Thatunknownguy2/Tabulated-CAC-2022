using Tabulated.Models;
using Microsoft.EntityFrameworkCore;

namespace Tabulated.DBModels
{
    public class ClassesDBContext : DbContext
    {
        public DbSet<Class> Classes { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<SubTask> GoalSubTasks { get; set; }
        public DbSet<Goal> ClassGoals { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite($"Data Source=ClassesDB.db");
        }
    }
}
