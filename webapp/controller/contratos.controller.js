sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("fidelidademundial.com.zrecpcv.controller.contratos", {
        
        onInit: function () {

        },

        onCreateCont: function (evt) {

            var vTblContratos = this.getView().byId("TabCont");

            if ( vTblContratos.getSelectedIndex() > 0 )
            {
                var vIndex = vTblContratos.getSelectedIndex();
                                
                var aDadosContrato = {
                    "bukrs" : vTblContratos.getContextByIndex(vIndex).getObject().bukrs,
                    "recnnr" :  vTblContratos.getContextByIndex(vIndex).getObject().recnnr
                };

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
                oRouter.navTo("Routecriacao", aDadosContrato);

            }
            else
            {
                MessageToast.show("Nenhum contrato selecionado");
            }

        }

    });
});
