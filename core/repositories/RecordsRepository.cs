using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using core.Models;

namespace core.repositories
{
    public class RecordsRepository : IRecordsRepository
    {
        private DomainModelPostgreSqlContext _dataContext;
        public RecordsRepository(DomainModelPostgreSqlContext context)
        {
            _dataContext = context;
        }
        public IQueryable<Record> FindAllRecordsByUser(Guid userId)
        {
            return _dataContext.Records.Where(x => x.UserId == userId);
        }
    }

    public interface IRecordsRepository
    {
        IQueryable<Record> FindAllRecordsByUser(Guid userId);
    }
}
