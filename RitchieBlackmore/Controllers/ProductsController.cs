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


        public JsonResult GetProductsList(string sidx, string sord, int? page, int? rows, bool? _search)
        {
            List<ProductModel> productsList = SourseDbFactory.GetSourseDB().GetRangeSortedProducts((page.Value-1) * rows.Value, rows.Value, "Id", true);
            JsonResult result = new  JsonResult()
            	                 {
                                     Data = new { page = page, total = 100, records = 1000, rows = productsList }
	                             };
            return result;
        }

        public JsonResult GetStatisticProduct(string sidx, string nd, int page, int rows, bool _search)
        {
            List<OperationDataModel> statisticsList = SourseDbFactory.GetSourseDB().GetStatisticsProduct(7, 1, 10, "UserName", true);
            JsonResult result = new JsonResult()
            {
                Data = new { page = page, total = 100, records = 1000, rows = statisticsList }
            };
            return result;
        }

        [HttpPost]
        public void SaveChange(string _Name, decimal? _Price, int? id)
        {
            int s = 9;
        }


        public void CreateNewProduct(string name, string price)
        {
            ProductModel newProduct = new ProductModel();
            newProduct._Name = name;
            newProduct._Price = Convert.ToDecimal(price);
            newProduct._Quantity = 0;
        }

        public ActionResult CreateProductOperation(Int32? Id)
        {
            OperationModel newOperation = new OperationModel();
            newOperation._IdProduct = Id.Value;
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
