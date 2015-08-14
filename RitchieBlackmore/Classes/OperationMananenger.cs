using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RitchieBlackmore.Models;
using System.Web.Security;

namespace RitchieBlackmore.Classes
{
    public class OperationMananenger
    {
        private Dictionary<String, Int32> _DbOperationType;

        public OperationMananenger()
        {
            _DbOperationType = new Dictionary<String, Int32>();
            _DbOperationType.Add("arrival", 1);
            _DbOperationType.Add("expense", 2);
        }

        public Int32 GetOperationId(String operationName)
        {
            return _DbOperationType[operationName];
        }

        private void UpdateProductAfterOperation(OperationModel operation) 
        {
            ProductModel product = SourseDbFactory.GetSourseDB().GetProductById(operation.IdProduct);

            if (operation.IdOperation == GetOperationId("arrival"))
            {
                product.Quantity = product.Quantity - operation.Quantity;
            }

            if (operation.IdOperation == GetOperationId("expense"))
            {
                product.Quantity = product.Quantity + operation.Quantity;
            }

            SourseDbFactory.GetSourseDB().UpdateProduct(product);
        }

        public void PerformOperation(OperationModel operation)
        {
            MembershipUser mu = Membership.GetUser();
            Guid userId = (Guid)mu.ProviderUserKey;
            operation.IdOperation = Convert.ToInt32(operation.SelectedTypeOperation);
            this.UpdateProductAfterOperation(operation);
            SourseDbFactory.GetSourseDB().AddNewOperation(operation, userId, DateTime.Now);
        }

        //public List<OperationDataModel> GetPageProductOperation(Int32 productId, String groupName, String sortType, Int32 page, Int32 rows)
        //{
        //    int correctPage = PageManager.GetCorrectPage(GetCountProductOperations(productId), rows, page);

        //    List<OperationDataModel> list = SourseDbFactory.GetSourseDB().GetStatisticsProduct(productId, (correctPage - 1) * rows, rows, groupName, sortType);

        //    return list;
        //}

        
    }
}