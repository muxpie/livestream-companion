sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
  "use strict";

  function isEPGUpdatedRecently(dateString) {
    var now = new Date();
    var epgUpdatedAt = new Date(dateString);
    var diffInHours = Math.abs(now - epgUpdatedAt) / (1000 * 60 * 60);
    return diffInHours <= 6;
  }

  return Controller.extend("myApp.controller.Playlists", {
    onInit: function () {
      var oModel = new JSONModel();
      this.getView().setModel(oModel, "playlistModel");
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("Playlists").attachMatched(this._onRouteMatched, this);

      // Check import status every 2 seconds
      this._checkImportStatusInterval = setInterval(this._checkImportStatus.bind(this), 2000);
    },

    _checkImportStatus: function() {
      var oModel = this.getView().getModel("playlistModel");
      var aPlaylists = oModel.getData();
    
      // If at least one playlist is in progress or not started, refresh the model
      if (aPlaylists.length > 0 && aPlaylists.every(function(oPlaylist) { return oPlaylist.ImportStatus === 0 || oPlaylist.ImportStatus === 1 || (oPlaylist.ImportStatus === 1 && oPlaylist.EpgStatus === 0) || oPlaylist.EpgStatus === 1; })) {
        oModel.loadData("/api/playlists");
      }
    },

    onExit: function() {
      // Clear the interval when the view is destroyed to avoid memory leaks
      clearInterval(this._checkImportStatusInterval);
    },

    _onRouteMatched: function() {
      var oModel = this.getView().getModel("playlistModel");
      oModel.loadData("/api/playlists");
    },

    onAdd: function (oEvent) {
      var sPlaylistId = "new";
    
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("PlaylistDetail", {playlistId: sPlaylistId});
    },

    onEdit: function (oEvent) {
      var oRowContext = oEvent.getSource().getBindingContext("playlistModel");          
      var sPlaylistId = oRowContext.getProperty("ID");
    
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("PlaylistDetail", {playlistId: sPlaylistId});
    },

    onDelete: function (oEvent) {
      var oRowContext = oEvent.getSource().getParent().getBindingContext("playlistModel");          
      var sPlaylistId = oRowContext.getProperty("ID");

      // Delete Confirmation Dialog
      MessageBox.confirm("Are you sure you want to delete this playlist?", {
        onClose: function(oAction) {
          if (oAction === MessageBox.Action.OK) {
            // Perform deletion
            jQuery.ajax({
              url: "/api/playlist/" + sPlaylistId,
              type: "DELETE",
              success: function() {
                MessageBox.success("Playlist successfully deleted");
                // Update the model
                var oModel = this.getView().getModel("playlistModel");
                oModel.loadData("/api/playlists");
              }.bind(this),
              error: function() {
                MessageBox.error("Failed to delete the playlist");
              }
            });
          }
        }.bind(this)
      });
    },

    formatter: {
      getImportStatusIcon: function (status) {
        switch (status) {
          case 0:
            return "sap-icon://pending";
          case 1:
            return "sap-icon://in-progress";
          case 2:
            return "sap-icon://accept";
          case -1:
            return "sap-icon://decline";
          default:
            return "sap-icon://question-mark";
        }
      },

      getImportStatusTooltip: function (status) {
        switch (status) {
          case 0:
            return "Import not started - click to start";
          case 1:
            return "Import in progress";
          case 2:
            return "Import completed - click to retrigger";
          case -1:
            return "Import failed - click to retry";
          default:
            return "Unknown status";
        }
      },

      getEpgStatusIcon: function (status, dateString) {
        switch (status) {
          case 0:
            return "sap-icon://pending";
          case 1:
            return "sap-icon://in-progress";
          case 2:
            return isEPGUpdatedRecently(dateString) ? "sap-icon://accept" : "sap-icon://decline";
          case -1:
            return "sap-icon://decline";
          default:
            return "sap-icon://question-mark";
        }
      },

      getEpgStatusTooltip: function (status, dateString) {
        switch (status) {
          case 0:
            return "EPG not updated - click to start";
          case 1:
            return "EPG update in progress";
          case 2:
            return isEPGUpdatedRecently(dateString) ? "EPG up to date - click to refresh" : "EPG out of date - click to update";
          case -1:
            return "EPG update failed - click to retry";
          default:
            return "Unknown status";
        }
      },
    },
    
  });
});
