using RitchieBlackmore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

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
            List<ProductModel> productsList = RitchieBlackmore.Classes.SourseDbFactory.GetSourseDB().GetProductsInRangeSortByField((page.Value-1) * rows.Value, rows.Value, "Id", true);
            JsonResult result = new  JsonResult()
            	                 {
                                     Data = new { page = page, total = 100, records = 1000, rows = productsList }
	                             };
            return result;
        }

        public JsonResult GetStatisticProduct(string sidx, string nd, int page, int rows, bool _search)
        {
            List<OperationDataModel> statisticsList = RitchieBlackmore.Classes.SourseDbFactory.GetSourseDB().GetOperationStatistcs(7, 1, 10, "UserName", true);
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
            int i = 4;
        }

        public ActionResult CreateProductOperation(Int32? Id)
        {
            OperationModel newOperation = new OperationModel();
            newOperation._IdProduct = Id.Value;
            return PartialView("CreateOperation", newOperation);
        }

        [HttpPost]
        public ActionResult CreateProductOperation(OperationModel obj)
        {
            return View("Index");
        }
    }
}
