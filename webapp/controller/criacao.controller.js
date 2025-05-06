sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    var Filtro = [];
    var sBukrs = "";
    var sRecnnr = "";

    return Controller.extend("fidelidademundial.com.zrecpcv.controller.criacao", {
        
        onInit: function () {
            //this.getRouter().getRoute("Routecriacao").attachPatternMatched(this._onObjectMatched, this);
            this.getOwnerComponent().getRouter().getRoute("Routecriacao").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched : function (oEvent) {

            var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZRE_GW_CPCV_SRV", true);
            var vObj = "";

            sBukrs = oEvent.getParameter("arguments").bukrs;  // Empresa
            Filtro.push(new sap.ui.model.Filter("Bukrs", "EQ",sBukrs));

            sRecnnr = oEvent.getParameter("arguments").recnnr;  // Contrato Reserva
            Filtro.push(new sap.ui.model.Filter("Recnnr", "EQ",sRecnnr));

            oModel.read("/EntConditionsSet", {
                urlParameters: {
                    "$top": 9999
                },
                success: function (oData, response) {
                    this.WriteData(oData);
                }.bind(this),
                error: function (err) {
                    
                },
                filters: Filtro
            }
            );
            

            var vLblBukrs = this.getView().byId("lblBukrs");
            vLblBukrs.setText(sBukrs);

            var vLblRecnnr = this.getView().byId("lblRecnnr");
            vLblRecnnr.setText(sRecnnr);

        },

        WriteData: function (results) {

            var oTable      = this.getView().byId("TabConditions");
            var oModel = new sap.ui.model.json.JSONModel();

            oModel.setData(results);
            oTable.setModel(oModel);
            Filtro = [];

        }   

    });
});
