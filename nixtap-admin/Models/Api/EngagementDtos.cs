namespace nixtap_admin.Models.Api
{
    public class LeadDto
    {
        public long id { get; set; }
        public long cardId { get; set; }
        public string? visitorName { get; set; }
        public string? visitorEmail { get; set; }
        public string? visitorPhone { get; set; }
        public string? message { get; set; }
        public DateTime createdAt { get; set; }
    }

    public class AppointmentDto
    {
        public long id { get; set; }
        public long cardId { get; set; }
        public string? visitorName { get; set; }
        public string? visitorEmail { get; set; }
        public string? visitorPhone { get; set; }
        public DateTime requestedDatetime { get; set; }
        public string? message { get; set; }
        public string? status { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }

    public class FeedbackDto
    {
        public long id { get; set; }
        public long cardId { get; set; }
        public string? visitorName { get; set; }
        public short rating { get; set; }
        public string? comment { get; set; }
        public DateTime createdAt { get; set; }
    }
}
