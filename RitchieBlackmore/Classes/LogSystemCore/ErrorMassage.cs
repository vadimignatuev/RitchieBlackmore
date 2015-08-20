using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Classes.LogSystemCore
{
    public class ErrorMassage : EventArgs
    {
        public String Massage { get; private set; }

        public ErrorMassage(String massage) 
        {
            Massage = massage;
        }
    }
}