namespace Backend.Dtos
{
    public class reviewDTO
    {

        public string? description { set; get; }

        public int rate { set; get; }

        public string? UserId { set; get; }

        public string? ISBN { set; get; }

        public UserDto? UserDto { get; set; }

    }
}
