sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Item",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, Item, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("myApp.controller.Categories", {

    onInit: function () {
      var oModel = new JSONModel();
      this.getView().setModel(oModel, "categoriesModel");

      var playlistsModel = new JSONModel();
      this.getView().setModel(playlistsModel, "playlistsModel");
      playlistsModel.loadData("/api/playlists");

      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("Categories").attachMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function() {
      var playlistsModel = this.getView().getModel("playlistsModel");
      playlistsModel.loadData("/api/playlists");

      playlistsModel.attachRequestCompleted(function () {
        var firstPlaylistID = playlistsModel.getData()[0].ID;

        var oModel = this.getView().getModel("categoriesModel");
        oModel.loadData("/api/playlists/" + firstPlaylistID + "/categories");

        var aPlaylists = playlistsModel.getData();
        var oPlaylistSelect = this.byId("playlistSelect");

        oPlaylistSelect.removeAllItems();
        aPlaylists.forEach(function(oPlaylist) {
          oPlaylistSelect.addItem(new Item({key: oPlaylist.ID, text: oPlaylist.Description}));
        }.bind(this));

        // Select the first playlist initially
        oPlaylistSelect.setSelectedKey(firstPlaylistID);
      }.bind(this));
    },

    onPlaylistSelectChange: function (oEvent) {
      var selectedPlaylistID = oEvent.getSource().getSelectedKey();
      var categoriesModel = this.getView().getModel("categoriesModel");
      categoriesModel.loadData("/api/playlists/" + selectedPlaylistID + "/categories");
    },

    onToggleActive: function (oEvent) {
      var oContext = oEvent.getSource().getBindingContext("categoriesModel");
      var oData = oContext.getObject();

      // Toggle active
      oData.Active = !oData.Active;

      // Synchronize changes with the server
      jQuery.ajax("/api/category/" + oData.ID, {
        method: "PUT",
        data: JSON.stringify(oData),
        contentType: "application/json",
        success: function() {

        },
        error: function() {
          oData.Active = !oData.Active;
        }
      });

      // Refresh model data
      this.getView().getModel("categoriesModel").refresh(true);
    },

    onActivateAll: function () {
      var playlistID = this.byId("playlistSelect").getSelectedKey();

      jQuery.ajax("/api/category/active/" + playlistID, {
        method: "PUT",
        data: JSON.stringify({ Active: true }),
        contentType: "application/json",
        success: function() {
          // Success message
          MessageToast.show("All categories activated successfully");

          // Refresh the categories model to reflect the changes
          var categoriesModel = this.getView().getModel("categoriesModel");
          categoriesModel.loadData("/api/playlists/" + playlistID + "/categories");
        }.bind(this),
        error: function() {
          // Handle error
          alert("Error while activating all categories");
        }
      });
    },

    onDeactivateAll: function () {
      var playlistID = this.byId("playlistSelect").getSelectedKey();

      jQuery.ajax("/api/category/active/" + playlistID, {
        method: "PUT",
        data: JSON.stringify({ Active: false }),
        contentType: "application/json",
        success: function() {
          // Success message
          MessageToast.show("All categories deactivated successfully");

          // Refresh the categories model to reflect the changes
          var categoriesModel = this.getView().getModel("categoriesModel");
          categoriesModel.loadData("/api/playlists/" + playlistID + "/categories");
        }.bind(this),
        error: function() {
          // Handle error
          alert("Error while deactivating all categories");
        }
      });
    },

    onLiveSearch: function(oEvent) {
        var sValue = oEvent.getSource().getValue();
        var aFilters = [];
        var oFilterName = new sap.ui.model.Filter("category_name", sap.ui.model.FilterOperator.Contains, sValue);
        aFilters.push(oFilterName);
    
        var oFilter = new sap.ui.model.Filter({
          filters: aFilters,
          and: false // using OR operator, change to true if you want to use AND operator
        });
    
        var oTable = this.getView().byId("categoriesTable");
        var oBinding = oTable.getBinding("items");
        oBinding.filter(oFilter, "Application");
    }
  });
});
