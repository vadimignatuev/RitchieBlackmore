﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RitchieBlackmore.Interfaces;

namespace RitchieBlackmore.Classes
{
    public class SourseDbFactory
    {
        public static ISourseDb GetSourseDB()
        {
            return new EntityFrameworkSourse();
        }
    }
}