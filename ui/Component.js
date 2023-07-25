sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device"
], function(UIComponent, Device) {
    "use strict";

    return UIComponent.extend("myApp.Component", {

        metadata: {
            manifest: "json"
        },

        init: function() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            //this.setModel(models.createDeviceModel(), "device");
        }
    });
});

