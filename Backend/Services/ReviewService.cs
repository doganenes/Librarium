using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ReviewService
    {
        private readonly IRepository<Review> _reviewRepository;
        private readonly LibraryContext _dbContext;

        public ReviewService(IRepository<User> userRepository, IRepository<Review> reviewRepository, LibraryContext dbContext)
        {
            _reviewRepository = reviewRepository;
            _dbContext = dbContext;
        }


        public async Task MakeaReview(string userId, string ISBN, float rate, string description)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            var book = await _dbContext.Books.FirstOrDefaultAsync(b => b.ISBN == ISBN);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            if (book == null)
                throw new KeyNotFoundException("Book not found.");

            var review = new Review
            {
                ISBN = ISBN,
                ReviewRate = rate,
                Description = description,
                CreatedDate = DateTime.Now
            };

            book?.Reviews?.Add(review);
            _reviewRepository.Insert(review);
            await _dbContext.SaveChangesAsync();
        }

    }
}
