using Backend.Data.Entities;
using System.Linq.Expressions;

namespace Backend.Repositories.Abstract
{
    public interface IRepository<T> where T : class
    {
        public void Delete(T t);
        public void Insert(T t);
        public void Update(T t);
        public Task<List<T>> GetListAllAsyncFilter(Expression<Func<T, bool>> predicate = null);
        public T GetByEmail(Expression<Func<T, bool>> condition);
        public T GetById(string id);
    
        public IQueryable<T> GetAll();

    }
}
