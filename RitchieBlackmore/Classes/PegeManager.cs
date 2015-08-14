using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RitchieBlackmore.Classes
{
    public class PageManager
    {

        public Int32 Page { get; set; }

        public Int32 CountRowsInPage { get; set; }

        public Int32 TotalRowsCount { get; set; }

        public PageManager(Int32 page, Int32 countRowsInPage, Int32 totalRowsCount) 
        {
            Page = page;
            CountRowsInPage = countRowsInPage;
            TotalRowsCount = totalRowsCount;
            Page = GetCorrectPage(Page);
        }

        public Int32 GetCountPage()
        {
            Int32 pageCount;

            if (TotalRowsCount % CountRowsInPage > 0)
            {
                pageCount = TotalRowsCount / CountRowsInPage + 1;
            }
            else 
            {
                pageCount = TotalRowsCount / CountRowsInPage;
            }
            return pageCount;
        }

        public Int32 GetCorrectPage(Int32 page)
        {
            int startPage;
            int maxCountPage = GetCountPage();
            if (page > maxCountPage)
            {
                startPage = (maxCountPage);
            }
            else
            {
                startPage = page;
            }
            return startPage;
        }

        public Int32 GetStartPosition()
        {
            return (Page - 1) * CountRowsInPage;
        }

    }
}