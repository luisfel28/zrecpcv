sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("fidelidademundial.com.zrecpcv.controller.contratos", {
        
        onInit: function () {

        },

        onCreateCont: function () {

            var vTblContratos = this.getView().byId("TabCont");

            if ( vTblContratos.getSelectedIndex() > 0 )
            {

            }
            else
            {
                MessageToast.show("Nenhum contrato selecionado");
            }

        }

    });
});
