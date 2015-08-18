using RitchieBlackmore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Classes
{
    public class LogSystem : Singleton<LogSystem>
    {
        private List<KeyValuePair<Guid, ProductModel>> ListSessionEdit { get; set; }
        private Dictionary<Type, String> MassegeDictionary { get; set; }
        private String MassegeUnknownError { get; set; }
        
        private LogSystem() 
        {
            MassegeUnknownError = "Error occurred in server";
            ListSessionEdit = new List<KeyValuePair<Guid,ProductModel>>();
            InitDictionaryMasseges();
        }

        private void InitDictionaryMasseges()
        {
            MassegeDictionary = new Dictionary<Type, string>();
        }

        public void AddSessionEdit(Guid userId, ProductModel product) 
        {
            ListSessionEdit.Add(new KeyValuePair<Guid, ProductModel>(userId, product));
        }

        public ProductModel GetProductBeforeEdit(Guid userId, Int32 productId)
        {
            return ListSessionEdit.Where(it => it.Key == userId).LastOrDefault(it => it.Value.Id == productId).Value;
        }

        public Boolean Compare(ProductModel firstProduct, ProductModel secondProduct) 
        {
            if (firstProduct.Id != secondProduct.Id)
            {
                return false;
            }

            if (firstProduct.Name != secondProduct.Name)
            {
                return false;
            }

            if (firstProduct.Price != secondProduct.Price)
            {
                return false;
            }

            return true;
        }

        public Boolean IsСhanged(Guid userId, Int32 productId) 
        {
            ProductModel beforeEdit = GetProductBeforeEdit(userId, productId);

            if (beforeEdit != null)
            {
                ProductManager productManager = new ProductManager();
                ProductModel presentProduct = productManager.GetProduct(productId);
                return !Compare(beforeEdit, presentProduct);
            }
            else 
            {
                return false;
            }
        }

        public void DeleteEditSession(Guid userId, Int32 productId) 
        {
            ListSessionEdit.Remove(ListSessionEdit.Where(it => it.Key == userId).FirstOrDefault(it => it.Value.Id == productId));
        } 

        public TableChangesProduct GetTableChangesProduct(Guid userId, ProductModel editProduct)
        {
            TableChangesProduct tableChangesProduct = new TableChangesProduct();
            ProductManager productManager = new ProductManager();
            tableChangesProduct.EditProduct = editProduct;
            tableChangesProduct.ProductBeforeEdit = GetProductBeforeEdit(userId, editProduct.Id);
            tableChangesProduct.PresentProduct = productManager.GetProduct(editProduct.Id);
            return tableChangesProduct;
        }

        public String GetErrorMassage(Exception e) 
        {
            if(MassegeDictionary.ContainsKey(e.GetType())) 
            {
                return MassegeDictionary[e.GetType()] ;
            }
            else
            {
                return null;
            }
        }


                
    }
}