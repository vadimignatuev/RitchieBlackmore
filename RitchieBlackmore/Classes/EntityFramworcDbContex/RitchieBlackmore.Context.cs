﻿//------------------------------------------------------------------------------
// <auto-generated>
//    Этот код был создан из шаблона.
//
//    Изменения, вносимые в этот файл вручную, могут привести к непредвиденной работе приложения.
//    Изменения, вносимые в этот файл вручную, будут перезаписаны при повторном создании кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace RitchieBlackmore.Classes.EntityFramworcDbContex
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class RitchieBlackmoreEntities : DbContext
    {
        public RitchieBlackmoreEntities()
            : base("name=RitchieBlackmoreEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<OperationType> OperationType { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<StatisticsOperation> StatisticsOperation { get; set; }
        public DbSet<Users> Users { get; set; }
    
        public virtual int DeleteProduct(Nullable<int> productId)
        {
            var productIdParameter = productId.HasValue ?
                new ObjectParameter("ProductId", productId) :
                new ObjectParameter("ProductId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("DeleteProduct", productIdParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> GetCountProducts()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("GetCountProducts");
        }
    
        public virtual ObjectResult<Product> GetRangeSortedProducts(Nullable<int> startPosition, Nullable<int> quantity, string columnName, Nullable<bool> sortOrder)
        {
            var startPositionParameter = startPosition.HasValue ?
                new ObjectParameter("StartPosition", startPosition) :
                new ObjectParameter("StartPosition", typeof(int));
    
            var quantityParameter = quantity.HasValue ?
                new ObjectParameter("Quantity", quantity) :
                new ObjectParameter("Quantity", typeof(int));
    
            var columnNameParameter = columnName != null ?
                new ObjectParameter("ColumnName", columnName) :
                new ObjectParameter("ColumnName", typeof(string));
    
            var sortOrderParameter = sortOrder.HasValue ?
                new ObjectParameter("SortOrder", sortOrder) :
                new ObjectParameter("SortOrder", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Product>("GetRangeSortedProducts", startPositionParameter, quantityParameter, columnNameParameter, sortOrderParameter);
        }
    
        public virtual ObjectResult<Product> GetRangeSortedProducts(Nullable<int> startPosition, Nullable<int> quantity, string columnName, Nullable<bool> sortOrder, MergeOption mergeOption)
        {
            var startPositionParameter = startPosition.HasValue ?
                new ObjectParameter("StartPosition", startPosition) :
                new ObjectParameter("StartPosition", typeof(int));
    
            var quantityParameter = quantity.HasValue ?
                new ObjectParameter("Quantity", quantity) :
                new ObjectParameter("Quantity", typeof(int));
    
            var columnNameParameter = columnName != null ?
                new ObjectParameter("ColumnName", columnName) :
                new ObjectParameter("ColumnName", typeof(string));
    
            var sortOrderParameter = sortOrder.HasValue ?
                new ObjectParameter("SortOrder", sortOrder) :
                new ObjectParameter("SortOrder", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Product>("GetRangeSortedProducts", mergeOption, startPositionParameter, quantityParameter, columnNameParameter, sortOrderParameter);
        }
    
        public virtual ObjectResult<GetStatisticsProduct_Result> GetStatisticsProduct(Nullable<int> prodactId, Nullable<int> startPosition, Nullable<int> quantity, string columnName, Nullable<bool> sortOrder)
        {
            var prodactIdParameter = prodactId.HasValue ?
                new ObjectParameter("ProdactId", prodactId) :
                new ObjectParameter("ProdactId", typeof(int));
    
            var startPositionParameter = startPosition.HasValue ?
                new ObjectParameter("StartPosition", startPosition) :
                new ObjectParameter("StartPosition", typeof(int));
    
            var quantityParameter = quantity.HasValue ?
                new ObjectParameter("Quantity", quantity) :
                new ObjectParameter("Quantity", typeof(int));
    
            var columnNameParameter = columnName != null ?
                new ObjectParameter("ColumnName", columnName) :
                new ObjectParameter("ColumnName", typeof(string));
    
            var sortOrderParameter = sortOrder.HasValue ?
                new ObjectParameter("SortOrder", sortOrder) :
                new ObjectParameter("SortOrder", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GetStatisticsProduct_Result>("GetStatisticsProduct", prodactIdParameter, startPositionParameter, quantityParameter, columnNameParameter, sortOrderParameter);
        }
    }
}
