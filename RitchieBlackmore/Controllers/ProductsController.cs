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
    [Authorize]
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
                    productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts(0, 10, "Id", sord);
                }
                else
                {
                    productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts((page.Value - 1) * rows.Value, rows.Value, "Id", sord);
                }
            }
            else 
            {
                if (page == null)
                {
                    productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts(0, 10, "Id", sord);
                }
                else
                {
                    productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts((page.Value - 1) * rows.Value, rows.Value, "Id", sord);
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

        public JsonResult GetStatisticProduct(String sidx, String sord, Int32 page, Int32 rows, Boolean _search, Int32? productId)
        {
            List<OperationDataModel> statisticsList;

            if (sord == "asc")
            {
                statisticsList = SourseDbFactory.GetSourseDB().GetStatisticsProduct(7, 1, 10, "UserName", sord);
            }
            else
            {
                statisticsList = SourseDbFactory.GetSourseDB().GetStatisticsProduct(7, 1, 10, "UserName", sord);
            }            

            int countRows = SourseDbFactory.GetSourseDB().GetCountOperationWithProduct(7);
            JsonResult result = new JsonResult()
            {
                Data = new { page = page, total = 100, records = 1000, rows = statisticsList }
            };
            return result;
        }

        //[HttpPost]
        public void SaveChange(Int32 Id, String Name, Decimal Price)
        {
            ProductModel updatingProduct = SourseDbFactory.GetSourseDB().GetProductById(Id);
            updatingProduct.Name = Name;
            updatingProduct.Price = Price;
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
        public ActionResult ProductDetails(Int32 id)
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
            newOperation.ListTypeOperation = new SelectList(list, "Value", "Text");
            newOperation.SelectedTypeOperation = "1";
            return PartialView("CreateOperation", newOperation);
        }

        [HttpPost]
        public void CreateProductOperation(OperationModel operation)
        {
            OperationMananenger operationManager = new OperationMananenger();
            operationManager.PerformOperation(operation);
            //return PartialView("ProductDetails");
        }

        public Boolean DeleteRow(Int32 id)
        {
            SourseDbFactory.GetSourseDB().DeleteProduct(id);
            return true;
        }

        public ActionResult StatisticsOperationProduct(int productId)
        {
            ViewBag.ProductId = productId;
            return PartialView();
        }
    }
}
