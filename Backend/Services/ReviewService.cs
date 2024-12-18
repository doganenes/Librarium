using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ReviewService
    {
        private readonly LibraryContext _dbContext;

        public ReviewService(LibraryContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task MakeReview(reviewDTO r)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == r.UserId);
            var book = await _dbContext.Books.FirstOrDefaultAsync(b => b.ISBN == r.ISBN);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            if (book == null)
                throw new KeyNotFoundException("Book not found.");

            var review = new Review
            {
                ISBN = r.ISBN,
                ReviewRate = r.rate,
                Description = r.description,
                CreatedDate = DateTime.Now
            };

            user.Reviews.Add(review);
            book.Reviews.Add(review);
            await _dbContext.SaveChangesAsync();
        }
    }
}
