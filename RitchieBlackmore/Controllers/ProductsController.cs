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
                Data = new { page = page, total = productManager.GetCountPage(), records = productManager.GetCountProduct(), rows = productsList }
            };
            return result;
        }

        public JsonResult GetStatisticProduct(String sidx, String sord, Int32 page, Int32 rows, Boolean? _search, Int32 productId)
        {
            OperationManager operationMananenger = new OperationManager(productId, page, rows);
            List<OperationDataModel> statisticsList = operationMananenger.GetPageProductOperation(productId, sidx, sord);

            JsonResult result = new JsonResult()
            {
                Data = new { page = page, total = operationMananenger.GetCountPage(), records = operationMananenger.GetCountRecords(productId), rows = statisticsList }
            };
            return result;
        }

        public void StartEditRow(Int32 productId, String productName, Decimal price)
        {
            ProductModel editProduct = new ProductModel();
            editProduct.Id = productId;
            editProduct.Name = productName;
            editProduct.Price = price;
            MembershipUser mu = Membership.GetUser();
            LogSystem.Instance.AddSessionEdit((Guid)mu.ProviderUserKey, editProduct);
        }

        public JsonResult EndEditRow(Int32 productId)
        {
            MembershipUser mu = Membership.GetUser();
            JsonResult result = new JsonResult()
            {
                Data = new { isChanges = LogSystem.Instance.IsСhanged((Guid)mu.ProviderUserKey, productId) }
            };
            return result;
        }

        //[HttpPost]
        public JsonResult SaveChange(Int32 Id, String Name, Decimal Price)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    ProductManager productManager = new ProductManager();
                    ProductModel updatingProduct = productManager.GetProduct(Id);
                    updatingProduct.Name = Name;
                    updatingProduct.Price = Price;
                    productManager.UpdateProduct(updatingProduct);
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
                ProductManager productManager = new ProductManager();
                productManager.AddNewProduct(product);
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
            ProductManager productManager = new ProductManager();
            return PartialView(productManager.GetProduct(id)); 
        }

        public ActionResult CreateProductOperation(Int32 Id)
        {
            OperationManager operationManager = new OperationManager();
            OperationModel newOperation = operationManager.CreateNewOperation(Id);
            return PartialView("CreateOperation", newOperation);
        }

        [HttpPost]
        public JsonResult CreateProductOperation(OperationModel operation)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    OperationManager operationManager = new OperationManager();
                    operationManager.PerformOperation(operation);
                }
            }
            catch (Exception e)
            {
                ModelState.AddModelError("", e.Message);
            }
            return PrepareJsonResult();           
        }

        public JsonResult DeleteProduct(Int32 id)
        {
            try
            {
                ProductManager operationManager = new ProductManager();
                operationManager.DeleteProduct(id);
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
               
    }
}
