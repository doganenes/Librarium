using Backend.Data.Context;
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

        public T GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public List<T> GetListAll()
        {
            return _dbSet.ToList();
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

        public List<T> GetListAll(Expression<Func<T, bool>> filter)
        {
            return _dbSet.Where(filter).ToList();
        }

        public T GetByEmail(Expression<Func<T, bool>> condition)
        {
            return _dbSet.FirstOrDefault(condition);
        }
    }

}
