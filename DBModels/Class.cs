using System.ComponentModel.DataAnnotations.Schema;

namespace Tabulated.Models
{
    public class Class
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string StudentUID { get; set; }
        public string TeacherName { get; set; }
        public string ClassName { get; set; }
        public string ClassInfo { get; set; }
    }

    public class Goal
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Guid ClassGUID { get; set; }
        public string StudentUID { get; set; }
        public string Name { get; set; }
    }

    public class SubTask
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Guid GoalGUID { get; set; }
        public string StudentUID { get; set; }
        public string Name { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class Assignment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Guid ClassGUID { get; set; }
        public string StudentUID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DueDate { get; set; }
    }
}
