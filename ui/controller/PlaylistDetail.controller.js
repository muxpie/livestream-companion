sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
  "use strict";
  
  return Controller.extend("myApp.controller.PlaylistDetail", {
    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("PlaylistDetail").attachMatched(this._onRouteMatched, this);

      var oTypeModel = new JSONModel([{
        key: "xcode",
        text: "Xtream Code"
      }, {
        key: "m3u",
        text: "M3U"
      }]);
      this.getView().setModel(oTypeModel, "typeModel");


    },

    _onRouteMatched: function (oEvent) {
      var oArgs, oView, oModel;
      oArgs = oEvent.getParameter("arguments");
      oView = this.getView();

      oModel = new JSONModel();

      if (oArgs.playlistId === "new") {
        // If the user navigates to "new", initialize an empty model
        oModel.setData({
          ID: "",
          Server: "",
          Username: "",
          Password: "",
          Type: "xcode",
          XmltvURL: "",
          M3uURL: "",
          Restream: true
        });
      } else {
        oModel.loadData("/api/playlist/" + oArgs.playlistId);
      }

      oView.setModel(oModel);
    },

    onSave: function () {
      // Get the updated data from the model
      var oModel = this.getView().getModel().getData();
      console.log(oModel)

      if (oModel.ID === "") {
        // Send an HTTP PUT request to the API
        var oNewData = Object.assign({}, oModel);
        delete oNewData.ID;
        $.ajax({
          url: "/api/playlist",
          method: "POST",
          data: JSON.stringify(oNewData),
          contentType: "application/json",
          success: function() {
            MessageToast.show("Data updated successfully!");
          },
          error: function() {
            MessageToast.show("Failed to update data.");
          }
        });

      } else {
        // Send an HTTP PUT request to the API
        $.ajax({
          url: "/api/playlist/" + oModel.ID,
          method: "PUT",
          data: JSON.stringify(oModel),
          contentType: "application/json",
          success: function() {
            MessageToast.show("Data updated successfully!");
          },
          error: function() {
            MessageToast.show("Failed to update data.");
          }
        });
      }

      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Playlists");
    },

    onCancel: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Playlists");
    },

    onBuildXmltvUrl: function() {
      var oModel = this.getView().getModel();
      var sBaseUrl = oModel.getProperty("/Server");
      var sUsername = oModel.getProperty("/Username");
      var sPassword = oModel.getProperty("/Password");
    
      var sXmltvUrl = sBaseUrl + "/xmltv.php?username=" + sUsername + "&password=" + sPassword;
    
      oModel.setProperty("/XmltvURL", sXmltvUrl);
    
      // if the model does not have two-way binding
      this.byId("xmltvURL").setValue(sXmltvUrl);
    }
    
  });
});

