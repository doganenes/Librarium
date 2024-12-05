using System.Linq.Expressions;

namespace Backend.Repositories.Abstract
{
    public interface IRepository<T> where T : class
    {
        public void Delete(T t);
        public T GetById(int id);
        public List<T> GetListAll();
        public void Insert(T t);
        public void Update(T t);
        public List<T> GetListAll(Expression<Func<T, bool>> filter);
        public T GetByEmail(Expression<Func<T, bool>> condition);

    }
}
