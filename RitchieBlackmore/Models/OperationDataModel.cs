using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Models
{
    public class OperationDataModel
    {
        public String OperatorName {get; set;}

        public String OperationName { get; set; }

        public Int32 Quantity { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateOperation { get; set; }
    }
}