using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RitchieBlackmore.Models
{
    
    public class ProductModel
    {
        [HiddenInput(DisplayValue = false)]
        public Int32 Id {get; set;}

        [Required(ErrorMessage = "field must be filled")]
        [StringLength(50, ErrorMessage = "Product name length effluents should be less than 50 characters")]
        [Display(Name = "Product")]
        public String Name { get; set; }

        [Required(ErrorMessage = "field must be filled")]
        [Range(0.01, 10000, ErrorMessage = "price can not be more than 10 000")]
        [Display(Name = "Price")]
        public Decimal Price { get; set; }

        [Required(ErrorMessage = "field must be filled")]
        [Display(Name = "Quantity")]
        public Int32 Quantity { get; set; }

        [Required(ErrorMessage = "field must be filled")]
        [Display(Name = "Total cost")]
        public Decimal TotalCost { get; set; }
    }
}