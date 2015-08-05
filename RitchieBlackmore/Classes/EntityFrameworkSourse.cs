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

        public ProductModel GetProductById(int id)
        {
            throw new NotImplementedException();
        }

        public List<ProductModel> GetProductsInRangeSortByField(int startPosition, int count, string field, bool SortOrder)
        {
            List<Models.ProductModel> listProducts;

            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                var s = db.GetRangeSortedProducts(startPosition, count, field, SortOrder);
                listProducts = s.Select(it => Mapper.DynamicMap<Models.ProductModel>(it)).ToList();
            }
            return listProducts;
        }

        public List<OperationDataModel> GetOperationStatistcs(int productId, int startPosition, int count, string field, bool SortOrder)
        {
            Mapper.CreateMap<GetStatisticsProduct_Result, OperationDataModel>()
                .ForMember(op => op._OperatorName, conf => conf.MapFrom(ol => ol.UserName));
            
            List<OperationDataModel> listStatistics;
            
            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                //var s = db.GetStatisticsProduct(productId, startPosition, count, field, SortOrder).To<OperationDataModel>().ToList();
                //listProducts = s.Select(it => Mapper.DynamicMap<Models.OperationDataModel>(it)).ToList();
                listStatistics = Mapper.Map<ObjectResult<GetStatisticsProduct_Result>, List<OperationDataModel>>(db.GetStatisticsProduct(productId, startPosition, count, field, SortOrder));
            }

            return listStatistics;
        }

        public void AddNewOperation()
        {
            throw new NotImplementedException();
        }

        public void AddNewProduct(Models.ProductModel product)
        {
            throw new NotImplementedException();
        }

        public void UpdateProduct(ProductModel product)
        {
            throw new NotImplementedException();
        }

        public void DeleteProduct(int id)
        {
            using (RitchieBlackmoreEntities db = new RitchieBlackmoreEntities())
            {
                db.DeleteProduct(id);
            }
        }
    }
}