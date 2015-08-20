using RitchieBlackmore.Classes.LogSystemCore;
using RitchieBlackmore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Classes
{
    public class LogSystem : Singleton<LogSystem>
    {
        private Dictionary<Type, String> MassegeDictionary { get; set; }
        public event EventHandler<ErrorMassage> ErrorInSystem;
        
        private LogSystem() 
        {
            InitDictionaryMasseges();
        }

        private void InitDictionaryMasseges()
        {
            MassegeDictionary = new Dictionary<Type, string>();
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

        public Boolean IsСhanged(ProductModel product) 
        {
            if (product != null)
            {
                ProductManager productManager = new ProductManager();
                ProductModel presentProduct = productManager.GetProduct(product.Id);
                return !Compare(product, presentProduct);
            }
            else 
            {
                return false;
            }
        }

        public TableChangesProduct GetTableChangesProduct(ProductModel productBeforeEdit, ProductModel productAfterEdit)
        {
            TableChangesProduct tableChangesProduct = new TableChangesProduct();
            ProductManager productManager = new ProductManager();
            tableChangesProduct.EditProduct = productAfterEdit;
            tableChangesProduct.ProductBeforeEdit = productBeforeEdit;
            tableChangesProduct.PresentProduct = productManager.GetProduct(productAfterEdit.Id);
            return tableChangesProduct;
        }

        public void PublishErrorMassage(String errorMassege)
        {
            if (errorMassege != null && ErrorInSystem != null)
            {
                ErrorInSystem(this, new ErrorMassage(errorMassege));
            }
        }


                
    }
}