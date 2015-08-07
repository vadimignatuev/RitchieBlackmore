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


        public JsonResult GetProductsList(String sidx, String sord, Int32 page, Int32 rows, Boolean _search)
        {
            List<ProductModel> productsList;
            
            if (sord == "asc")
            {
                productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts((page - 1) * rows, rows, "Id", true);
            }
            else 
            {
                productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts((page - 1) * rows, rows, "Id", false);
            }            

            int countRows = SourseDbFactory.GetSourseDB().GetCountProduct();
            JsonResult result = new  JsonResult()
            	                 {
                                     Data = new { page = page, total = countRows/rows, records = countRows, rows = productsList }
	                             };
            return result;
        }

        public JsonResult GetStatisticProduct(String sidx, String sord, Int32 page, Int32 rows, Boolean _search, String userData)
        {
            List<OperationDataModel> statisticsList;

            if (sord == "asc")
            {
                statisticsList = SourseDbFactory.GetSourseDB().GetStatisticsProduct(7, 1, 10, "UserName", _search);
            }
            else
            {
                statisticsList = SourseDbFactory.GetSourseDB().GetStatisticsProduct(7, 1, 10, "UserName", _search);
            }            

            int countRows = SourseDbFactory.GetSourseDB().GetCountOperationWithProduct(7);
            JsonResult result = new JsonResult()
            {
                Data = new { page = page, total = 100, records = 1000, rows = statisticsList }
            };
            return result;
        }

        [HttpPost]
        public void SaveChange(Int32 _Id, String _Name, Decimal _Price)
        {
            ProductModel updatingProduct = SourseDbFactory.GetSourseDB().GetProductById(_Id);
            updatingProduct.Name = _Name;
            updatingProduct.Price = _Price;
            SourseDbFactory.GetSourseDB().UpdateProduct(updatingProduct);
        }

        [HttpGet]
        public ActionResult CreateNewProduct()
        {
            ProductModel newProduct = new ProductModel();
            return PartialView(newProduct);
        }

        [HttpPost]
        public void CreateNewProduct(ProductModel newProduct)
        {
            newProduct.Quantity = 0;
        }

        public ActionResult ProductStatistics(int id)
        {
            ProductModel product = SourseDbFactory.GetSourseDB().GetProductById(id);
            return PartialView(product); 
        }

        public ActionResult CreateProductOperation(Int32? Id)
        {
            OperationModel newOperation = new OperationModel();
            newOperation.IdProduct = Id.Value;
            return PartialView("CreateOperation", newOperation);
        }

        [HttpPost]
        public ActionResult CreateProductOperation(OperationModel operation)
        {
            OperationMananenger operationManager = new OperationMananenger();
               operationManager.PerformOperation(operation);
            return RedirectToAction("Index");
        }
    }
}
