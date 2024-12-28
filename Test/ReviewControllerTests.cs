using Backend.Controllers;
using Backend.Dtos;
using Backend.Services;
using Backend.Data.Context;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using Backend.Data.Entities;
using Xunit.Abstractions;

namespace Test
{
    public class ReviewControllerTests
    {
        private readonly ReviewController _reviewController;
        private readonly ReviewService _reviewService;
        private readonly ITestOutputHelper _output;


        public ReviewControllerTests(ITestOutputHelper output)
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(databaseName: "TestLibraryDatabase")
                .Options;

            var dbContext = new LibraryContext(options);

            _reviewService = new ReviewService(dbContext);
            _reviewController = new ReviewController(_reviewService);
            _output = output;
        }

        [Fact]
        public async Task MakeReview_ShouldReturnOk_WhenReviewIsMadeSuccessfully()
        {
            var user = new User { UserId = "user123", FirstName = "TestUserFirstName" , LastName="TestUserLastName"};
            var book = new Book { ISBN = "1234567890", BookTitle = "Test Book", AvgRating = 0 };

            using (var context = new LibraryContext(new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase("TestLibraryDatabase").Options))
            {
                context.Users.Add(user);
                context.Books.Add(book);
                await context.SaveChangesAsync();
            }

            var reviewDto = new ReviewDto
            {
                UserId = "user123",
                ISBN = "1234567890",
                rate = 5,
                description = "Great book!"
            };

            var result = await _reviewController.MakeReview(reviewDto);

            result.Should().BeOfType<OkObjectResult>();
            _output.WriteLine("Review submitted successfully.");
        }

    }
}
