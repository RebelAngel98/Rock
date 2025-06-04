// <copyright>
// Copyright by the Spark Development Network
//
// Licensed under the Rock Community License (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.rockrms.com/license
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// </copyright>

using Rock;
using Rock.Data;
using Rock.Model;
using Rock.Web.UI;
using System;
using System.ComponentModel;
using System.Web.UI;

namespace RockWeb.Blocks.Utility
{
    [DisplayName("KL - Stark Detail")]
    [Category("Utility")]
    [Description("Displays Name, Description, DateCreated, DateModified, and Capacity for a single 'Small Group'.")]
    public partial class KL_StarkDetail: RockBlock
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                ShowGroupDetails();
            }
        }

        /// <summary>
        /// Reads the "GroupGuid" page parameter, validates it, and if found,
        /// loads that Group and populates the five detail fields.
        /// </summary>
        private void ShowGroupDetails()
        {
            // 1) Retrieve the "GroupGuid" from the query string
            string guidParam = PageParameter("GroupGuid");
            if (string.IsNullOrWhiteSpace(guidParam))
            {
                lError.Text = "No group specified.";
                return;
            }

            if (!Guid.TryParse(guidParam, out Guid groupGuid))
            {
                lError.Text = "Invalid group ID.";
                return;
            }

            // 2) Query the database for that Group by Guid
            var rockContext = new RockContext();
            var group = new GroupService(rockContext).Get(groupGuid);
            if (group == null)
            {
                lError.Text = "Group not found.";
                return;
            }

            // 3) Populate the UI fields and show the panel
            pnlDetails.Visible = true;

            lName.Text = group.Name;
            lDescription.Text = group.Description;
            lDateCreated.Text = group.CreatedDateTime?.ToString("g") ?? string.Empty;
            lDateModified.Text = group.ModifiedDateTime?.ToString("g") ?? string.Empty;
            lCapacity.Text = group.GroupCapacity.HasValue
                                ? group.GroupCapacity.Value.ToString()
                                : "N/A";
        }
    }
}
