using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Models
{
    public class TableChangesProduct
    {
        public ProductModel EditProduct { get; set; }

        public ProductModel PresentProduct { get; set; }

        public ProductModel ProductBeforeEdit { get; set; }
                       
    }
}