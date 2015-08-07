using AutoMapper;
using RitchieBlackmore.Classes.EntityFramworcDbContex;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using RitchieBlackmore.Models;
using System.Data.Entity.Core.Objects;

namespace RitchieBlackmore.Classes
{
    public class EntityFrameworkSourse : RitchieBlackmore.Interfaces.ISourseDb
    {

        public ProductModel GetProductById(Int32 id)
        {
            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                return Mapper.Map<Product, ProductModel>(db.Product.FirstOrDefault(it => it.Id == id));
            }
        }

        public List<ProductModel> GetRangeSortedProducts(Int32 startPosition, Int32 count, String field, Boolean SortOrder)
        {
            List<Models.ProductModel> listProducts;

            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                var s = db.GetRangeSortedProducts(startPosition, count, field, SortOrder);
                listProducts = s.Select(it => Mapper.DynamicMap<Models.ProductModel>(it)).ToList();
            }
            return listProducts;
        }

        public List<OperationDataModel> GetStatisticsProduct(Int32 productId, Int32 startPosition, Int32 count, String field, Boolean SortOrder)
        {
            Mapper.CreateMap<GetStatisticsProduct_Result, OperationDataModel>()
                .ForMember(op => op._OperatorName, conf => conf.MapFrom(ol => ol.UserName));
            
            List<OperationDataModel> listStatistics;
            
            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                listStatistics = Mapper.Map<ObjectResult<GetStatisticsProduct_Result>, List<OperationDataModel>>(db.GetStatisticsProduct(productId, startPosition, count, field, SortOrder));
            }

            return listStatistics;
        }

        public void AddNewOperation(OperationModel operation, Guid userId, DateTime dateOperation)
        {
            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                StatisticsOperation newOperation = new StatisticsOperation();
                newOperation.OperationTypeId = operation._IdOperation;
                newOperation.ProductId = operation._IdProduct;
                newOperation.Quantity = operation._Quantity;
                newOperation.UserId = userId;
                newOperation.DateOperation = dateOperation;
                db.StatisticsOperation.Add(newOperation);
                db.SaveChanges();
            }
        }

        public void AddNewProduct(Models.ProductModel product)
        {
            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                db.Product.Add(Mapper.Map<ProductModel, Product>(product));
                db.SaveChanges();
            }
        }

        public void UpdateProduct(ProductModel product)
        {
            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                Product updatingProduct = db.Product.FirstOrDefault(it => it.Id == product._Id);
                if (updatingProduct != null)
                {
                    updatingProduct = Mapper.Map<ProductModel, Product>(product);
                    db.SaveChanges();
                }
            }
        }

        public void DeleteProduct(Int32 id)
        {
            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                db.DeleteProduct(id);
            }
        }
    }
}