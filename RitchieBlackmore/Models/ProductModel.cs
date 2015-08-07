using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Models
{
    public class ProductModel
    {
        public Int32 Id {get; set;}

        public String Name { get; set; }

        public Decimal Price { get; set; }

        public Int32 Quantity { get; set; }

        public Decimal TotalCost { get; set; }
    }
}