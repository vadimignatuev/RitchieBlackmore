using RitchieBlackmore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Classes
{
    public class ProductManager : PageManager
    {
        public ProductManager() : base(0, 0, 0) 
        { 
        } 

        public ProductManager(Int32 page, Int32 countRowsInPage)
            : base(page, countRowsInPage, SourseDbFactory.GetSourseDB().GetCountProduct()) 
        { 
        }
        
        private ProductModel BuildModel(ProductModel product)
        {
            product.TotalCost = product.Price * product.Quantity;
            return product;
        }

        public Int32 GetCountProduct()
        {
            return SourseDbFactory.GetSourseDB().GetCountProduct();
        }

        public Int32 GetCountProductOperations(Int32 id)
        {
            return SourseDbFactory.GetSourseDB().GetCountOperationWithProduct(id);
        }

        public List<ProductModel> GetPageProduct(String groupName, String sortType)
        {
            List<ProductModel> list = SourseDbFactory.GetSourseDB().GetRangeSortedProducts( GetStartPosition(), CountRowsInPage, groupName, sortType);

            for (int i = 0; i < list.Count; i++)
            {
                list[i] = BuildModel(list[i]);
            }

            return list;
        }

        public static bool UpdateProduct(ProductModel product)
        {
            try 
            {
                SourseDbFactory.GetSourseDB().UpdateProduct(product);
                return true;
            }
            catch(Exception e)
            {
                return false;
            }
        }


    }
}