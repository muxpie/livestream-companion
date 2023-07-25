sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Item",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
  ], function (Controller, Item, JSONModel, MessageToast) {
    "use strict";
  
    return Controller.extend("myApp.controller.Channels", {
  
      onInit: function () {
        var oModel = new JSONModel();
        this.getView().setModel(oModel, "channelsModel");
  
        var playlistsModel = new JSONModel();
        this.getView().setModel(playlistsModel, "playlistsModel");
        playlistsModel.loadData("/api/playlists");
  
        var categoriesModel = new JSONModel();
        this.getView().setModel(categoriesModel, "categoriesModel");
  
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("Channels").attachMatched(this._onRouteMatched, this);
      },
  
      _onRouteMatched: function() {
        var playlistsModel = this.getView().getModel("playlistsModel");
        playlistsModel.loadData("/api/playlists");
  
        playlistsModel.attachRequestCompleted(function () {
            var firstPlaylistID = playlistsModel.getData()[0].ID;
          
            var categoriesModel = this.getView().getModel("categoriesModel");
            categoriesModel.loadData("/api/playlists/" + firstPlaylistID + "/categories/active");
          
            categoriesModel.attachRequestCompleted(function() {
              var aCategories = categoriesModel.getData();
              var oCategorySelect = this.byId("categorySelect");
          
              oCategorySelect.removeAllItems();
              // Add an option for all categories
              oCategorySelect.addItem(new Item({key: "all", text: "All categories"}));
              aCategories.forEach(function(oCategory) {
                oCategorySelect.addItem(new Item({key: oCategory.ID, text: oCategory.category_name}));
              }.bind(this));

              // Select "All categories" initially
              oCategorySelect.setSelectedKey("all");

              var channelsModel = this.getView().getModel("channelsModel");
              channelsModel.loadData("/api/playlists/" + playlistsModel.getData()[0].ID + "/channels");

            }.bind(this));
          
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
        categoriesModel.loadData("/api/playlists/" + selectedPlaylistID + "/categories/active");
      
        // Store the reference to "this" in a variable for later use inside the callback
        var that = this;
      
        categoriesModel.attachRequestCompleted(function () {
          var oCategorySelect = that.byId("categorySelect");
          oCategorySelect.setSelectedKey("all");
      
          that.onCategorySelectChange({
            getSource: function() {
              return oCategorySelect;
            }
          });
        });
      },
      
  
      onCategorySelectChange: function (oEvent) {
        var selectedPlaylistID = this.byId("playlistSelect").getSelectedKey();
        var selectedCategoryID = oEvent.getSource().getSelectedKey();
    
        var channelsModel = this.getView().getModel("channelsModel");
        if (selectedCategoryID === "all") { // If "All categories" is selected
          channelsModel.loadData("/api/playlists/" + selectedPlaylistID + "/channels");
        } else {
          channelsModel.loadData("/api/categories/" + selectedCategoryID + "/channels");
        }
      },

      onActivateAll: function () {
        var selectedPlaylistID = this.byId("playlistSelect").getSelectedKey();
        var selectedCategoryID = this.byId("categorySelect").getSelectedKey();
  
        var channelsModel = this.getView().getModel("channelsModel");
        if (selectedCategoryID === "all") { // If "All categories" is selected
          var playlistID = selectedPlaylistID;

          jQuery.ajax("/api/playlists/" + playlistID + "/channels/activateAll/", {
            method: "PUT",
            data: JSON.stringify({ Active: true }),
            contentType: "application/json",
            success: function() {
              // Success message
              MessageToast.show("All channels activated successfully");

              // Refresh the categories model to reflect the changes
              var channelsModel = this.getView().getModel("channelsModel");
              channelsModel.loadData("/api/playlists/" + selectedPlaylistID + "/channels");
            }.bind(this),
            error: function() {
              // Handle error
              alert("Error while activating all categories");
            }
          });
        } else {
          var categoryID = selectedCategoryID;

          jQuery.ajax("/api/category/" + categoryID + "/channels/activateAll", {
            method: "PUT",
            data: JSON.stringify({ Active: true }),
            contentType: "application/json",
            success: function() {
              // Success message
              MessageToast.show("All channels activated successfully");
    
              // Refresh the categories model to reflect the changes
              var channelsModel = this.getView().getModel("channelsModel");
              channelsModel.loadData("/api/playlists/" + selectedPlaylistID + "/channels");
            }.bind(this),
            error: function() {
              // Handle error
              alert("Error while deactivating all channels");
            }
          });
        }
      },
  
      onDeactivateAll: function () {
        var selectedPlaylistID = this.byId("playlistSelect").getSelectedKey();
        var selectedCategoryID = this.byId("categorySelect").getSelectedKey();
  
        var channelsModel = this.getView().getModel("channelsModel");
        if (selectedCategoryID === "all") { // If "All categories" is selected
          var playlistID = selectedPlaylistID;

          jQuery.ajax("/api/playlists/" + playlistID + "/channels/activateAll", {
            method: "PUT",
            data: JSON.stringify({ Active: false }),
            contentType: "application/json",
            success: function() {
              // Success message
              MessageToast.show("All channels deactivated successfully");
    
              // Refresh the categories model to reflect the changes
              var channelsModel = this.getView().getModel("channelsModel");
              channelsModel.loadData("/api/playlists/" + selectedPlaylistID + "/channels");
            }.bind(this),
            error: function() {
              // Handle error
              alert("Error while deactivating all channels");
            }
          });
        } else {
          var categoryID = selectedCategoryID;

          jQuery.ajax("/api/category/" + categoryID + "/channels/activateAll", {
            method: "PUT",
            data: JSON.stringify({ Active: false }),
            contentType: "application/json",
            success: function() {
              // Success message
              MessageToast.show("All channels deactivated successfully");
    
              // Refresh the categories model to reflect the changes
              var channelsModel = this.getView().getModel("channelsModel");
              channelsModel.loadData("/api/playlists/" + selectedPlaylistID + "/channels");
            }.bind(this),
            error: function() {
              // Handle error
              alert("Error while deactivating all channels");
            }
          });
        }
      },

      onToggleActive: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext("channelsModel");
        var oData = oContext.getObject();
      
        // Toggle active
        oData.Active = !oData.Active;
      
        // Synchronize changes with the server
        jQuery.ajax("/api/channel/" + oData.ID, {
          method: "PUT",
          data: JSON.stringify(oData),
          contentType: "application/json",
          success: function() {
      
          },
          error: function() {
            // If the server responds with an error, revert the change in the UI
            oData.Active = !oData.Active;
            // Also update the model, so that the UI reflects the correct state
            this.getView().getModel("channelsModel").refresh(true);
          }.bind(this) // bind the current controller context to the error function
        });

        // Refresh model data
        this.getView().getModel("channelsModel").refresh(true);
      },

      onChannelPress: function (oEvent) {
        //var oContext = oEvent.getSource().getBindingContext("channelsModel");
        var oContext = oEvent.getSource().getParent().getBindingContext("channelsModel");
        var oData = oContext.getObject();
        var sChannelId = oData.ID; // Get the ID of the clicked channel
        var sChannelName = oData.name;

        // If the dialog has not been instantiated yet...
        if (!this._oDialog) {
            // Instantiate the dialog
            this._oDialog = new sap.m.Dialog({
                title: sChannelName,
                content: new sap.ui.core.HTML({ // Create HTML control with an iframe pointing to your stream.html page
                    content: "<iframe src='/player/stream.html?channel=" + sChannelId + "' width='640' height='480'></iframe>", // Replace URL as necessary
                    preferDOM: false
                }),
                beginButton: new sap.m.Button({
                    text: 'Close',
                    press: function () {
                        this._oDialog.close(); // Close the dialog when the "Close" button is pressed
                    }.bind(this)
                })
            });
        }
        else {
            // If the dialog has already been instantiated, update the iframe src with the new channel ID
            this._oDialog.setTitle(sChannelName);
            this._oDialog.getContent()[0].setContent("<iframe src='/player/stream.html?channel=" + sChannelId + "' width='640' height='480'></iframe>");
        }
        
        // Open the dialog
        this._oDialog.open();
      },

      onLiveSearch: function(oEvent) {
          var sValue = oEvent.getSource().getValue();
          var aFilters = [];
          var oFilterName = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sValue);
          aFilters.push(oFilterName);
      
          var oFilter = new sap.ui.model.Filter({
            filters: aFilters,
            and: false // using OR operator, change to true if you want to use AND operator
          });
      
          var oTable = this.getView().byId("channelsTable");
          var oBinding = oTable.getBinding("items");
          oBinding.filter(oFilter, "Application");
      }    
    
    });
  });
  