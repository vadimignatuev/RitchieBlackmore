﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages.Html;

namespace RitchieBlackmore.Models
{
    public class OperationModel
    {
        public Int32 ProductId { get; set; }

        public Int32 OperationId { get; set; }

        [Required(ErrorMessage = "field must be filled")]
        [Range(0, 1000, ErrorMessage = "Quantity can not be in negative and more than 1000")]
        [Display(Name = "Quantity")]
        public Int32 Quantity { get; set; }

        public String ProductName { get; set; }

        public SelectList ListTypeOperation { get; set; }
                
    }
}