using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Models
{
    public class OperationDataModel
    {
        public String OperatorName {get; set;}

        public String OperationName { get; set; }

        public Int32 Quantity { get; set; }

        public DateTime DateOperation { get; set; }
    }
}