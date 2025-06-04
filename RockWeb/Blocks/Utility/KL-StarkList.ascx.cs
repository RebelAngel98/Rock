using Rock;
using Rock.Data;
using Rock.Model;
using Rock.Web.UI;
using Rock.Web.UI.Controls;
using System;
using System.ComponentModel;
using System.Linq;
using System.Web.UI;

namespace RockWeb.Blocks.Utility
{
    [DisplayName("KL - Stark List")]
    [Category("Utility")]
    [Description("Lists all active groups of type 'Small Group'.")]
    public partial class KL_StarkList : RockBlock, ICustomGridColumns
    {
        /// <summary>
        /// OnInit: wire up the grid rebind event and block updated trigger.
        /// </summary>
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            // NOTE: Do NOT do “gSmallGroups = new Grid();” here. 
            // Instead, gSmallGroups is already bound to <rock:Grid> from the ASCX via designer file.

            // Wire up the GridRebind event
            gSmallGroups.GridRebind += gSmallGroups_GridRebind;

            // If block settings change, rebind
            this.BlockUpdated += Block_BlockUpdated;
            this.AddConfigurationUpdateTrigger(upnlContent);
        }

        /// <summary>
        /// OnLoad: on first load (not postback), bind the grid.
        /// </summary>
        protected override void OnLoad(EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                BindGrid();
            }

            base.OnLoad(e);
        }

        /// <summary>
        /// Called when block settings are updated. We simply re-bind the grid.
        /// </summary>
        protected void Block_BlockUpdated(object sender, EventArgs e)
        {
            BindGrid();
        }

        /// <summary>
        /// Called when the grid needs to be rebound (e.g. sorting has changed).
        /// </summary>
        private void gSmallGroups_GridRebind(object sender, EventArgs e)
        {
            BindGrid();
        }

        /// <summary>
        /// Queries all active Group records of type “Small Group” and binds them to the grid.
        /// </summary>
        private void BindGrid()
        {
            var rockContext = new RockContext();

            // 1) Find the GroupType named "Small Group"
            var smallGroupType = new GroupTypeService(rockContext)
                .Queryable()
                .FirstOrDefault(gt => gt.Name == "Small Group");

            if (smallGroupType == null)
            {
                // If no such GroupType exists, show a notice and clear the grid
                lNotice.Text = "No Group Type found named 'Small Group'.";
                gSmallGroups.DataSource = null;
                gSmallGroups.DataBind();
                return;
            }

            // 2) Build a query for all active Groups of that type
            var qry = new GroupService(rockContext)
                .Queryable()
                .Where(g => g.GroupTypeId == smallGroupType.Id && g.IsActive)
                .Select(g => new
                {
                    g.Guid,
                    g.Name,
                    MemberCount = g.Members.Count(),
                    g.GroupCapacity
                });

            // 3) Apply sorting if a SortProperty is set
            var sortProperty = gSmallGroups.SortProperty;
            if (gSmallGroups.AllowSorting && sortProperty != null)
            {
                qry = qry.Sort(sortProperty);
            }
            else
            {
                qry = qry.OrderBy(g => g.Name);
            }

            // 4) Bind the results to the grid
            gSmallGroups.DataSource = qry.ToList();
            gSmallGroups.DataBind();
        }
    }
}
