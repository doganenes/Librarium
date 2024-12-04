namespace Backend.Utils.Security
{
    public static class SecurityHelper
    {
        public static string HashPasswordWithHmacSha256(string password)
        {
            string key = "your-secure-key";

            using (var hmac = new System.Security.Cryptography.HMACSHA256(System.Text.Encoding.UTF8.GetBytes(key)))
            {
                var hashedBytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        static bool VerifyPassword(string enteredPassword, string storedHashedPassword)
        {
            string hashedPassword = HashPasswordWithHmacSha256(enteredPassword);
            return hashedPassword == storedHashedPassword;
        }

    }
}
