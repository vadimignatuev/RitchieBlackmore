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
            ProductManager productManager = new ProductManager(page.Value, rows.Value);

            List<ProductModel> productsList = productManager.GetPageProduct(sidx, sord); 

            JsonResult result;
            int countRows = productManager.GetCountProduct();

            result = new JsonResult()
            {
                Data = new { page = page, total = countRows / rows, records = countRows, rows = productsList }
            };
            return result;
        }

        //public JsonResult GetStatisticProduct(String sidx, String sord, Int32 page, Int32 rows, Boolean? _search, Int32 productId)
        //{
        //    ProductManager productManager = new ProductManager();
        //    List<OperationDataModel> statisticsList = productManager.GetPageProductOperation(productId, sidx, sord, page, rows);
            
        //    JsonResult result = new JsonResult()
        //    {
        //        Data = new { page = page, total = 100, records = 1000, rows = statisticsList }
        //    };
        //    return result;
        //}

        //[HttpPost]
        public JsonResult SaveChange(Int32 Id, String Name, Decimal Price)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    ProductModel updatingProduct = SourseDbFactory.GetSourseDB().GetProductById(Id);
                    updatingProduct.Name = Name;
                    updatingProduct.Price = Price;
                    ProductManager.UpdateProduct(updatingProduct);
                }
                else 
                {
                    ModelState.AddModelError("", "Data is not valid");
                }
            }
            catch(Exception e) 
            {
                ModelState.AddModelError("", e.Message);
            }
            return PrepareJsonResult();           
        }

        [HttpPost]
        public ActionResult CreateNewProduct(ProductModel product)
        {
            if (ModelState.IsValid)
            {
                product.Quantity = 0;
                SourseDbFactory.GetSourseDB().AddNewProduct(product);
                ProductModel newProduct = new ProductModel();
                ViewBag.Massege = "Saccess!!!";
                return PartialView("CreateNewProduct", newProduct);
            }
            else
            {
                ModelState.AddModelError("", "Data is not valid");
                return PartialView("CreateNewProduct", product);
            }

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
        }

        public JsonResult DeleteProduct(Int32 id)
        {
            try
            {
                throw new NullReferenceException();
                SourseDbFactory.GetSourseDB().DeleteProduct(id);
            }
            catch(Exception e)
            {
                ModelState.AddModelError("", e.Message);
            }
            return PrepareJsonResult();
        }

        public ActionResult StatisticsOperationProduct(int productId)
        {
            ViewBag.ProductId = productId;
            return PartialView();
        }

        private JsonResult PrepareJsonResult()
        {
            var errors =
                ModelState.Values.Where(x => x.Errors.Count > 0)
                    .SelectMany(x => x.Errors)
                    .Select(x => x.Exception != null ? x.Exception.Message : x.ErrorMessage)
                    .Select(x => string.Format("<li>{0}</li>", x));
            var isValid = !errors.Any();
            var errorsString = String.Join("", errors);
            var data = string.Format("{{\"success\":{0}, \"errors\":\"{1}\"}}",
                isValid.ToString().ToLowerInvariant(),
                errorsString);
            var result = Json(data);
            return result;
        }
    }
}
