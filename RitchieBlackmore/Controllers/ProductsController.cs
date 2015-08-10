using RitchieBlackmore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Web.Security;
using RitchieBlackmore.Classes;

namespace RitchieBlackmore.Controllers
{
    public class ProductsController : Controller
    {
        //
        // GET: /Product/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetProductsList(String sidx, String sord, Int32? page, Int32? rows, Boolean? _search)
        {
            List<ProductModel> productsList;
            
            if (sord == "asc")
            {

                if (page == null) 
                {
                    productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts(0 , 10, "Id", true);
                }
                else
                {
                    productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts((page.Value - 1) * rows.Value, rows.Value, "Id", true);
                }
            }
            else 
            {
                if (page == null)
                {
                    productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts(0, 10, "Id", false);
                }
                else
                {
                    productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts((page.Value - 1) * rows.Value, rows.Value, "Id", false);
                }
            }

             JsonResult result;
            if (page == null)
            {
                int countRows = SourseDbFactory.GetSourseDB().GetCountProduct();
                result = new JsonResult()
                {
                    Data = new { page = 1, total = 10, records = countRows, rows = productsList }
                };
            }
            else
            {
                int countRows = SourseDbFactory.GetSourseDB().GetCountProduct();
                result = new JsonResult()
                                     {
                                         Data = new { page = page, total = countRows / rows, records = countRows, rows = productsList }
                                     };
            }
            return result;
        }

        public JsonResult GetStatisticProduct(String sidx, String sord, Int32 page, Int32 rows, Boolean _search, String userData, String keyword)
        {
            List<OperationDataModel> statisticsList;

            if (sord == "asc")
            {
                statisticsList = SourseDbFactory.GetSourseDB().GetStatisticsProduct(7, 1, 10, "UserName", true);
            }
            else
            {
                statisticsList = SourseDbFactory.GetSourseDB().GetStatisticsProduct(7, 1, 10, "UserName", true);
            }            

            int countRows = SourseDbFactory.GetSourseDB().GetCountOperationWithProduct(7);
            JsonResult result = new JsonResult()
            {
                Data = new { page = page, total = 100, records = 1000, rows = statisticsList }
            };
            return result;
        }

        //[HttpPost]
        public void SaveChange(Int32? _Id, String _Name, Decimal _Price)
        {
            ProductModel updatingProduct = SourseDbFactory.GetSourseDB().GetProductById(_Id);
            updatingProduct.Name = _Name;
            updatingProduct.Price = _Price;
            SourseDbFactory.GetSourseDB().UpdateProduct(updatingProduct);
        }

        [HttpPost]
        public ActionResult CreateNewProduct(ProductModel product)
        {
            product.Quantity = 0;
            SourseDbFactory.GetSourseDB().AddNewProduct(product);
            ProductModel newProduct = new ProductModel();
            return PartialView("CreateNewProduct", newProduct);
        }

        //[HttpPost]
        public ActionResult ProductStatistics(int id)
        {
            ProductModel product = SourseDbFactory.GetSourseDB().GetProductById(id);
            return PartialView(product); 
        }

        public ActionResult CreateProductOperation(Int32? Id)
        {
            OperationModel newOperation = new OperationModel();
            newOperation.IdProduct = Id.Value;
            newOperation.ProductName = SourseDbFactory.GetSourseDB().GetProductById(Id.Value).Name;

            List<SelectListItem> list = new List<SelectListItem>();
            list.Add(new SelectListItem {
                Value = "1",
                Text = "Приход",
            });
            list.Add(new SelectListItem
            {
                Value = "2",
                Text = "Расход",
            });
            newOperation.list = new SelectList(list, "Value", "Text");
            return PartialView("CreateOperation", newOperation);
        }

        [HttpPost]
        public ActionResult CreateProductOperation(OperationModel operation)
        {
            OperationMananenger operationManager = new OperationMananenger();
              // operationManager.PerformOperation(operation);
            return PartialView("ProductStatistics");
        }

        //public ActionResult DeleteRow(Int32 id)
        //{
        //    return true;
        //}
    }
}
