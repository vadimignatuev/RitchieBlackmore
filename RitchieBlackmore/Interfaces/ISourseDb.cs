using RitchieBlackmore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RitchieBlackmore.Interfaces
{
    public interface ISourseDb
    {
        ProductModel GetProductById(Int32 id);

        List<ProductModel> GetRangeSortedProducts(Int32 startPosition, Int32 count, String field, Boolean SortOrder);

        List<OperationDataModel> GetStatisticsProduct(Int32 ProductId, Int32 startPosition, Int32 count, String field, Boolean SortOrder);

        void AddNewOperation(OperationModel operation, Guid userId, DateTime dateOperation);

        void AddNewProduct(ProductModel product);

        void UpdateProduct(ProductModel product);

        void DeleteProduct(Int32 id);

        Int32 GetCountProduct();

        Int32 GetCountOperationWithProduct(Int32 id);
    }
}
