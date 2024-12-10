using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Backend.Repositories.Concrete
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly LibraryContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(LibraryContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public void Delete(T t)
        {
            _dbSet.Remove(t);
            _context.SaveChanges();
        }

        public T GetByEmail(string email)
        {
            return _dbSet.Find(email);
        }

        public void Insert(T t)
        {
            _dbSet.Add(t);
            _context.SaveChanges();
        }

        public void Update(T t)
        {
            _dbSet.Update(t);
            _context.SaveChanges();
        }


        public T GetByEmail(Expression<Func<T, bool>> condition)
        {
            return _dbSet.FirstOrDefault(condition);
        }

        public T GetById(string id)
        {
            return _dbSet.Find(id);
        }

        public IQueryable<T> GetAll()
        {
            return _context.Set<T>().AsQueryable();
        }

    }

}
