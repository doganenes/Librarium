using Backend.Data.Entities;
using System.Linq.Expressions;

namespace Backend.Repositories.Abstract
{
    public interface IRepository<T> where T : class
    {
        public void Delete(T t);
        public void Insert(T t);
        public void InsertMultiple(IEnumerable<T> entities);
        public void Update(T t);
        public T GetByEmail(Expression<Func<T, bool>> condition);
        public T GetById(string id);
        public IQueryable<T> GetAll();
        public T GetByCondition(Expression<Func<T, bool>> condition);
        public List<T> GetAllByCondition(Expression<Func<T, bool>> condition);

    }
}
