using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using FluentFilters;
using FluentFilters.Criteria;

namespace RitchieBlackmore
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters, 
                   FluentFilterCollection fluentFilters)
        {
            filters.Add(new HandleErrorAttribute());

            fluentFilters.Add<AuthorizeAttribute>(c =>
            {
                c.Require(new ControllerFilterCriteria("Account")).And(
                    new AreaFilterCriteria("LogOn")).And(
                    new AreaFilterCriteria("Register"));
                c.Exclude(new ControllerFilterCriteria("Account")).And(
                    new AreaFilterCriteria("LogOn")).And(
                    new AreaFilterCriteria("Register"));
            });
            
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{productId}", // URL with parameters
                new { controller = "Products", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            // Use LocalDB for Entity Framework by default
            Database.DefaultConnectionFactory = new SqlConnectionFactory(@"Data Source=(localdb)\v11.0; Integrated Security=True; MultipleActiveResultSets=True");

            // Register provider
            FilterProviders.Providers.Add(FluentFiltersBuider.Filters);
            
            // Register Global Filters
            RegisterGlobalFilters(GlobalFilters.Filters,
                          FluentFiltersBuider.Filters);
            RegisterRoutes(RouteTable.Routes);
        }
    }
}