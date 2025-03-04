﻿using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace Backend.Services
{
    public class ReviewService
    {
        private readonly LibraryContext _dbContext;

        public ReviewService(LibraryContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task MakeReview(ReviewDto r)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == r.UserId);
            var book = await _dbContext.Books.FirstOrDefaultAsync(b => b.ISBN == r.ISBN);
            int reviewCount = _dbContext.Reviews.Count(rev => rev.ISBN == r.ISBN);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            if (book == null)
                throw new KeyNotFoundException("Book not found.");

            var review = new Review
            {
                ISBN = r.ISBN,
                ReviewRate = (r.rate),
                Description = r.description,
                CreatedDate = DateTime.Now
            };

            if (reviewCount > 0)
            {
                book.AvgRating = ((reviewCount * book.AvgRating) + r.rate) / (reviewCount + 1);
            }
            else
            {
                book.AvgRating = r.rate;
            }

            _dbContext.Books.Update(book);

            user.Reviews.Add(review);
            book.Reviews.Add(review);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Review>> GetBookReviews(string ISBN)
        {

            var reviews = await _dbContext.Reviews
                .Where(i => i.ISBN == ISBN)
                .ToListAsync();

            return reviews;
        }

        public async Task DeleteReview(int reviewId)
        {
            // Fetch the review to delete
            var review = await _dbContext.Reviews
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId);

            if (review == null)
                throw new KeyNotFoundException("Review not found.");

           
           

           
            var book = await _dbContext.Books
                .FirstOrDefaultAsync(b => b.ISBN == review.ISBN);

            if (book == null)
                throw new KeyNotFoundException("Book not found.");

           
            int reviewCount = _dbContext.Reviews.Count(rev => rev.ISBN == review.ISBN);
            decimal totalRating = _dbContext.Reviews
                .Where(rev => rev.ISBN == review.ISBN)
                .Sum(rev => rev.ReviewRate);

            if (reviewCount > 1)
            {
                book.AvgRating = (totalRating - review.ReviewRate) / (reviewCount - 1);
            }
            else
            {
                book.AvgRating = 0;
            }

          
            _dbContext.Reviews.Remove(review);

            await _dbContext.SaveChangesAsync();
        }


    }
}