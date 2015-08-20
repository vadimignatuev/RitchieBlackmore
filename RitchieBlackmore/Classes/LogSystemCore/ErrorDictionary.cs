using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Classes.LogSystemCore
{
    static public class ErrorDictionary
    {
        public const String NON_DB_CONNECTION = "Server have not connection with data base!!!";
        public const String DB_HAVE_NOT_ITEM = "Item already is missing in the database, perhaps it happened during your work!!!";
        public const String MASSAGE_UNNOUN_ERROR = "Error occurred in server";
    }
}