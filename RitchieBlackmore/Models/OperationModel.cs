using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages.Html;

namespace RitchieBlackmore.Models
{
    public class OperationModel
    {
        public Int32 IdProduct { get; set; }

        public Int32 IdOperation { get; set; }

        public Int32 Quantity { get; set; }

        public String ProductName { get; set; }

        public SelectList list { get; set; }

        public String choice { get; set; }

    }
}