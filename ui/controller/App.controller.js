sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
  "use strict";

  return Controller.extend("myApp.controller.App", {
    onInit: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("Playlists").attachPatternMatched(this._onPlaylistRouteMatched, this);
      //oRouter.getRoute("Category").attachPatternMatched(this._onCategoryRouteMatched, this);
      if (sap.ui.Device.system.phone) {
        this.byId("SideNavigation").setExpanded(false);
      }    
    },

    onSideNavButtonPress : function() {
      var oToolPage = this.byId("ToolPage");
      var bSideExpanded = oToolPage.getSideExpanded();
      oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
    },
  
    _onPlaylistRouteMatched : function (oEvent) {
      var oArgs, oView;
      var oRoute = oEvent.getParameter("name");
      
      oArgs = oEvent.getParameter("arguments");
      oView = this.getView();
      oView.bindElement({
        path : "/Playlist(" + oArgs.playlistId + ")",
        events : {
          change: this._onBindingChange.bind(this),
          dataRequested: function (oEvent) {
            oView.setBusy(true);
          },
          dataReceived: function (oEvent) {
            oView.setBusy(false);
          }
        }
      });
    },
    
    _onCategoryRouteMatched : function (oEvent) {
      // handle category route here
    },

    _onBindingChange : function (oEvent) {
      // No data for the binding
      if (!this.getView().getBindingContext()) {
        this.getRouter().getTargets().display("notFound");
      }
    },

    getRouter : function () {
      return UIComponent.getRouterFor(this);
    },

    onNavBack : function () {
      var oHistory = History.getInstance(),
        sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("home", {}, true);
      }
    },

    onItemSelect : function(oEvent) {
      var item = oEvent.getParameter('item');
      var key = item.getText();
      var oRouter = UIComponent.getRouterFor(this);

      if(key === "Home"){
        oRouter.navTo("home");
      } else {
        oRouter.navTo(key);
      }

      // collapse side navigation
      var toolPage = this.byId("ToolPage");
      // only collapse when on a phone
      if (sap.ui.Device.system.phone) {
        toolPage.setSideExpanded(false);
      }
    },

    onCopyServerAddress: function () {
        var sServerAddress = window.location.origin;
        if(navigator.clipboard) {
            navigator.clipboard.writeText(sServerAddress);
        } else {
            // Fallback for browsers that do not support navigator.clipboard
            var textarea = document.createElement("textarea");
            textarea.value = sServerAddress;
            textarea.style.top = "0";
            textarea.style.left = "0";
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textarea);
        }
    },
    
    onCopyXmltvLink: function () {
      var sServerAddress = window.location.origin + "/xmltv";
      if(navigator.clipboard) {
          navigator.clipboard.writeText(sServerAddress);
      } else {
          // Fallback for browsers that do not support navigator.clipboard
          var textarea = document.createElement("textarea");
          textarea.value = sServerAddress;
          textarea.style.top = "0";
          textarea.style.left = "0";
          textarea.style.position = "fixed";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          try {
              var successful = document.execCommand('copy');
              var msg = successful ? 'successful' : 'unsuccessful';
              console.log('Fallback: Copying text command was ' + msg);
          } catch (err) {
              console.error('Fallback: Oops, unable to copy', err);
          }
          document.body.removeChild(textarea);
      }
    }
    
  });
});
