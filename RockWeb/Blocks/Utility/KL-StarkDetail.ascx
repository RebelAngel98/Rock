<%@ Control Language="C#" AutoEventWireup="true" CodeFile="KL-StarkDetail.ascx.cs" Inherits="RockWeb.Blocks.Utility.KL_StarkDetail" %>

<asp:Literal ID="lError" runat="server" />

<asp:Panel ID="pnlDetails" runat="server" Visible="false">
    <h3>Small Group Details</h3>
    <dl class="row">
        <dt class="col-sm-3">Name:</dt>
        <dd class="col-sm-9"><asp:Literal ID="lName" runat="server" /></dd>

        <dt class="col-sm-3">Description:</dt>
        <dd class="col-sm-9"><asp:Literal ID="lDescription" runat="server" /></dd>

        <dt class="col-sm-3">Date Created:</dt>
        <dd class="col-sm-9"><asp:Literal ID="lDateCreated" runat="server" /></dd>

        <dt class="col-sm-3">Date Modified:</dt>
        <dd class="col-sm-9"><asp:Literal ID="lDateModified" runat="server" /></dd>

        <dt class="col-sm-3">Group Capacity:</dt>
        <dd class="col-sm-9"><asp:Literal ID="lCapacity" runat="server" /></dd>
    </dl>

    <a href="/small-groups" class="btn btn-default">
      ← Back to List
    </a>
</asp:Panel>
