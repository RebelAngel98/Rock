<%@ Control Language="C#" AutoEventWireup="true"
    CodeFile="KL-StarkList.ascx.cs"
    Inherits="RockWeb.Blocks.Utility.KL_StarkList" %>

<%@ Register TagPrefix="rock"
            Namespace="Rock.Web.UI.Controls"
            Assembly="Rock" %>

<asp:UpdatePanel ID="upnlContent" runat="server">
    <ContentTemplate>

        <h2>Small Groups</h2>

        <!-- Rock Grid with only DataControlField children inside <Columns> -->
        <rock:Grid ID="gSmallGroups"
                   runat="server"
                   AllowPaging="False"
                   AllowSorting="True"
                   GridRebind="gSmallGroups_GridRebind"
                   CssClass="table table-striped">
            <Columns>
                <asp:TemplateField HeaderText="Group Name" SortExpression="Name">
                    <ItemTemplate>
                        <asp:HyperLink
                            runat="server"
                            NavigateUrl='<%# "/small-group-detail?GroupGuid=" + Eval("Guid") %>'
                            Text='<%# Eval("Name") %>' />
                    </ItemTemplate>
                </asp:TemplateField>

                <asp:BoundField DataField="MemberCount"
                                HeaderText="Members"
                                SortExpression="MemberCount" />

                <asp:BoundField DataField="GroupCapacity"
                                HeaderText="Capacity"
                                SortExpression="GroupCapacity" />
            </Columns>
        </rock:Grid>

        <asp:Literal ID="lNotice" runat="server" />

    </ContentTemplate>
</asp:UpdatePanel>
