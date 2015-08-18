using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RitchieBlackmore.Models;
using System.Web.Security;
using System.Web.Mvc;

namespace RitchieBlackmore.Classes
{
    public class OperationManager : PageManager
    {
        private Dictionary<String, Int32> _DbOperationType;

        private void UpdateProductAfterOperation(OperationModel operation)
        {
            ProductModel product = SourseDbFactory.GetSourseDB().GetProductById(operation.ProductId);

            if (operation.OperationId == GetOperationId("arrival"))
            {
                product.Quantity = product.Quantity + operation.Quantity;
            }

            if (operation.OperationId == GetOperationId("expense"))
            {
                product.Quantity = product.Quantity - operation.Quantity;
            }

            SourseDbFactory.GetSourseDB().UpdateProduct(product);
        }

        public OperationManager() : base(0,0,0)
        {
            _DbOperationType = new Dictionary<String, Int32>();
            _DbOperationType.Add("arrival", 1);
            _DbOperationType.Add("expense", 2);
        }

        public OperationManager(Int32 productId, Int32 page, Int32 countRowsInPage)
            : base(page, countRowsInPage, SourseDbFactory.GetSourseDB().GetCountOperationWithProduct(productId)) 
        {
            int i = SourseDbFactory.GetSourseDB().GetCountOperationWithProduct(productId);
        }
    
        public Int32 GetOperationId(String operationName)
        {
            return _DbOperationType[operationName];
        }

        public void PerformOperation(OperationModel operation)
        {
            MembershipUser mu = Membership.GetUser();
            Guid userId = (Guid)mu.ProviderUserKey;
            operation.OperationId = Convert.ToInt32(operation.OperationId);
            this.UpdateProductAfterOperation(operation);
            SourseDbFactory.GetSourseDB().AddNewOperation(operation, userId, DateTime.Now);
        }

        public Int32 GetCountRecords(Int32 productId) 
        {
            return SourseDbFactory.GetSourseDB().GetCountOperationWithProduct(productId);
        }

        public List<OperationDataModel> GetPageProductOperation(Int32 productId, String groupName, String sortType)
        {
            List<OperationDataModel> list = SourseDbFactory.GetSourseDB().GetStatisticsProduct(productId, GetStartPosition(), CountRowsInPage, groupName, sortType);
            return list;
        }

        public OperationModel CreateNewOperation(int id)
        {
            OperationModel newOperation = new OperationModel();
            newOperation.ProductId = id;
            ProductManager productMamager = new ProductManager();
            newOperation.ProductName = productMamager.GetProduct(id).Name;
            List<SelectListItem> list = new List<SelectListItem>();
            
            foreach(var operation in _DbOperationType)
            {
                list.Add(new SelectListItem
                {
                    Value = operation.Value.ToString(),
                    Text = operation.Key,
                });
            }
            newOperation.ListTypeOperation = new SelectList(list, "Value", "Text");
            return newOperation;
        }
                
    }
}